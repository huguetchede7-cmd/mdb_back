import apiHelpers from '../../helpers/apiHelpers';
import ShortUniqueId from 'short-unique-id';
import UserModel from '../../../models/UserModel';
import {NotificationTypeModel} from '../../../models/NotificationTypeModel';
import {LogInAppNotificationModel} from '../../../models/LogInAppNotificationModel';
import { EmailHelpers } from '../../helpers/EmailHelpers';
import { LogHelpers } from '../../helpers/LogHelpers';
import {Sanitizer} from '../../helpers/sanitizer';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { FirebaseService } from '../../services/FirebaseService';

export class NotifcationController {

    static #includes = [
        {
            model: NotificationTypeModel,
            as: 'log_notification_type_detail'
        }
    ]

    static async stats(req: Request, res: Response) : Promise<void>  {
        try {
            const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
            const rapport = { read: 0, unread: 0, viewed: 0, unviewed: 0, total: 0 }
            const dataList = await LogInAppNotificationModel.findAll({
                where: { to_user: req.headers.auth_user },
                attributes: ['viewed_at', 'readed_at', 'archived_at'],
                include: NotifcationController.#includes
            })

            if (dataList.length < 1) {
                throw new Error()
            }

           for (const notif of dataList) {
                const notification = await notif.get({ plain: true })
                if (notification.viewed_at === null) {
                    rapport.unviewed++
                } else {
                    rapport.viewed++
                }
                if (notification.readed_at === null) {
                    rapport.unread++
                } else {
                    rapport.read++
                }
                rapport.total++
            }

            responseJson.message = "Liste complète des vos notifications"
            responseJson.data = {...rapport}
            responseJson.statut = true
            res.status(200).json(responseJson);
            return
        } catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error));
            return
        }
    }

    static async index(req: Request, res: Response) : Promise<void> {
        try {
            const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
            const pageQuery = req.query?.page;
            const currentPage: number = Number.isInteger(Number(pageQuery)) && Number(pageQuery) > 0  ? Number(pageQuery) : 1;
            const dataList = await LogInAppNotificationModel.findAll({
                where: { to_user: req.headers.auth_user },
                include: NotifcationController.#includes,
                limit: apiHelpers.FETCH_LIMIT,  
                offset: (currentPage - 1) * apiHelpers.FETCH_LIMIT,
                order: [
                    ['created_at', 'DESC']
                ]
            })

            if (dataList.length < 1) {
                throw new Error()
            }

            const listTotalCount = await LogInAppNotificationModel.count({
                where: { to_user: req.headers.auth_user }
            })

            responseJson.message = "Liste complète des vos notifications"
            responseJson.data = {
                totalCount: listTotalCount,
                currentPage: currentPage,
                perPage: apiHelpers.FETCH_LIMIT,
                list: dataList
            }
            responseJson.statut = true
            res.status(200).json(responseJson);
            return
        } catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error));
            return
        }
    }

    static async create(data: {[key: string]: string}, options : {sendEmailToUser?: boolean, sendPushNotification?: boolean} = { sendEmailToUser: true,  sendPushNotification : true }) {
        try {
            const nowDate = Sanitizer.getTimeByTimezone()
            await LogInAppNotificationModel.create(
                { ...data, readed_at: null, deleted_at: null, created_at: nowDate, updated_at: nowDate }
            )
            
            const getUserDetail = await UserModel.findByPk(data?.to_user)
            const getUserDetailData = getUserDetail?.get()

            // Send fcm puh notification 
            if (options?.sendPushNotification !== false && getUserDetailData?.fcm_token) {
                const firebaseAdminClient = new FirebaseService()
                await firebaseAdminClient.sendNotification({
                    token: getUserDetailData?.fcm_token, 
                    payload: {
                        title: data.title,
                        body: data?.short_description ?? data?.description ?? "Vous avez une notification en attente de lecture",
                    } 
                })
            }  

            // send Email
            if (options?.sendEmailToUser && typeof getUserDetail === "object" && getUserDetailData?.email) {
                const random = new ShortUniqueId({ length: 10 })
                const emailData = {
                    year: new Date().getFullYear(),
                    mailType: EmailHelpers.TYPE_DYNAMIC_NOTIFICATION,
                    mailRef: random.rnd(),
                    image: `${process.env.AWS_S3_BUCKET_PREFIX}/${process.env.APP_LOGO}`,
                    title: data.title,
                    body: data.description
                }
                const mailOptions = {
                    from: process.env.MAIL_USERNAME ?? "",
                    to: getUserDetailData?.email ?? "",
                    subject: data.title,
                    mailRef: emailData.mailRef,
                    data: emailData,
                    html: EmailHelpers.buildContent(emailData)
                }
                await EmailHelpers.send(mailOptions)
            }

            return true
        } catch (err) {
            LogHelpers.showException(err as Error)
            return false
        }
    }

    static async setReaded(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        const nowDate = Sanitizer.getTimeByTimezone()
        try {
            const target = await LogInAppNotificationModel.findOne({
                where: { to_user: req.headers.auth_user, id: req.body.notif_id },
            })
            await target?.update({ readed_at: nowDate })
            responseJson.message = "Notification Ref:" + req.body.notif_id + " lu"
            responseJson.statut = true
            res.status(200).json(responseJson);
            return
        } catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error));
            return
        }
    }

    static async setViewed(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        const nowDate = Sanitizer.getTimeByTimezone()
        try {
           await LogInAppNotificationModel.update(
                { viewed_at: nowDate }, 
                { where: { to_user: req.headers.auth_user, viewed_at: { [Op.is]: null } } 
            });

            responseJson.message = "Notification vues"
            responseJson.statut = true
            res.status(200).json(responseJson);
            return
        } catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error));
            return
        }
    }

};
