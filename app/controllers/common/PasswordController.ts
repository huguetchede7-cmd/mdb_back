import {Request, Response} from "express";
import apiHelpers from "../../helpers/apiHelpers";
import UserModel from "../../../models/UserModel";
import {Op} from "sequelize";
import Messengers from "../../helpers/messengers";
import {TOKEN_TYPES, TokenModel} from "../../../models/TokenModel";
import {TokenHelper} from "../../helpers/TokenHelpers";
import ShortUniqueId from "short-unique-id";
import {EmailHelpers} from "../../helpers/EmailHelpers";
import {BcryptCheck, BcryptMake} from "../../helpers/bcryptHelpers";
import {matchedData, validationResult} from "express-validator";
import {Sanitizer} from "../../helpers/sanitizer";

export class PasswordController {
    
    static async resetPasswordInit(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

        try {
            const data = req.body;

            if (!data.email) {
                throw new Error("__messageFormatted__email__" + Messengers.error.champs.requis);
            }

            const targetUser = await UserModel.findOne({
                where: {
                    email: data.email,
                    ban_statut: false,
                    email_verified_at: { [Op.ne]: null }
                }
            });

            // Vérification si l'utilisateur existe
            if (!targetUser) {
                throw new Error("__messageFormatted__email__" + Messengers.error.email.aucun_compte);
            }

            const targetUserDetail = targetUser.get();

            // Vérifier le nombre de demandes de réinitialisation aujourd'hui (maximum 2)
            const tokenCount = await TokenModel.count({
                where: {
                    user_id: targetUserDetail.id,
                    type:TOKEN_TYPES.PASSWORD_RESET,
                    created_at: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }
                }
            });

            if (tokenCount >= 2) {
                throw new Error( "__messageFormatted__" + "Vous avez déjà effectué deux demandes de réinitialisation aujourd'hui. Veuillez réessayer demain.")
            }

            // Génération d'un nouveau token
            const newToken =  await TokenHelper.generate({user: targetUserDetail.id as number, action: TOKEN_TYPES.PASSWORD_RESET, expirationMinutes: 10})
            responseJson.data = process.env.NODE_ENV ? {token: newToken} : null
            const resetUrlPrefix = data?.accountType == "admin" ? process.env.ADMIN_URL : process.env.WEBSITE_URL
            
            // Générer un code unique pour la référence de l'email
            const random = new ShortUniqueId({ length: 10 });
            const emailData = {
                mailType: EmailHelpers.TYPE_RESET_PASSWORD,
                resetLink: `${resetUrlPrefix}/auth/mot-de-passe-oublie-confirm?token=${newToken}`,
                mailRef: random.rnd(),
                platformName: process.env.APP_NAME,
                fullname: targetUserDetail?.lastname ? `${targetUserDetail?.lastname} ${targetUserDetail?.firstname}` : targetUserDetail?.firstname ?? ""
            };

            const mailOptions = {
                to: targetUserDetail.email ?? "", // Assurer que l'email est une chaîne
                mailRef: emailData.mailRef,
                subject: `Réinitialisation de votre mot de passe sur ${process.env.APP_NAME}`,
                data: emailData,
                html: EmailHelpers.buildContent(emailData),
            };

            // Envoi de l'email de réinitialisation
            const emailSent = await EmailHelpers.send(mailOptions);
            if (!emailSent) {
                throw new Error("__messageFormatted__" + Messengers.error.general.default);
            }

            // Réponse réussie
            responseJson.statut = true
            responseJson.message = "Un email contenant le lien de réinitialisation a été envoyé."
            res.status(200).json(responseJson)
            return

        } catch (err) {
            responseJson.statut = false;
            res.status(400).json(apiHelpers.bindError(err as Error))
            return
        }
    }

    static async resetPasswordProcess(req: Request, res: Response) : Promise<void> {
        const responseJson = {...apiHelpers.DEFAULT_RESPONSE_JSON}
        try {

            if (!req.body?.token) {
                throw new Error("")
            }

            if (!req.body?.new_password || req.body?.new_password.length < 6) {
                throw new Error("__messageFormatted__newPassword__" + "Le nouveau mot de passe doit contenir au moins 6 caractères.")
            }

            const { new_password,token } = req.body
            const decodedToken = await TokenHelper.validate(token as string,{action: TOKEN_TYPES.PASSWORD_RESET})

            if (!decodedToken) {
                throw new Error("__messageFormatted__newPassword__"+"Le lien de réinitialisation a expiré ou est invalide.")
            }

            // Vérifier si le token existe dans la base de données
            const tokenRecord = await TokenModel.findOne({
                where: {
                    user_id: decodedToken.user,
                    type: TOKEN_TYPES.PASSWORD_RESET,
                    is_active: true
                },
                include:[{
                    model: UserModel,
                    as: 'user',
                    attributes: ['email', 'firstname', 'lastname', 'username'],
                }],
                order: [['created_at', 'DESC']]
            })

            // Si le token n'existe pas dans la base de données
            if (!tokenRecord) {
                throw new Error("")
            }

            const tokenRecord_ = tokenRecord.get()

            if (tokenRecord_.token !== token) {
                throw new Error("")
            }

            // Si tout est valide, vous pouvez retourner une réponse indiquant que l'utilisateur peut réinitialiser son mot de passe
            const updateResult = await UserModel.update({
                password: await BcryptMake(new_password),
            }, { where: {
                    id: tokenRecord_.user_id
                }
            })

            if (!updateResult[0]) {
                throw new Error("__messageFormatted__" + Messengers.error.general.default);
            }

            const updateTokenResult = await TokenModel.update({ is_active: false }, { where: { token: tokenRecord_.token } })
            if (!updateTokenResult[0]) {
                throw new Error("__messageFormatted__" + Messengers.error.general.default);
            }

            const user = tokenRecord_.user.get();

            // Générer un code unique pour la référence de l'email
            const random = new ShortUniqueId({ length: 10 });
            const emailData = {
                mailType: EmailHelpers.TYPE_RESET_PASSWORD_SUCCESSFUL,
                fullname: user?.lastname ? `${user?.lastname} ${user?.firstname}` : user?.firstname ?? "",
                mailRef: random.rnd(),
                platformName: process.env.APP_NAME
            };

            const mailOptions = {
                to: user.email,
                mailRef: emailData.mailRef,
                subject: `Mis à jour de mot de passe sur ${process.env.APP_NAME}`,
                data: emailData,
                html: EmailHelpers.buildContent(emailData),
            };

            // Envoi de l'email de réinitialisation
            const emailSent = await EmailHelpers.send(mailOptions);
            if (!emailSent) {
                throw new Error("__messageFormatted__" + Messengers.error.general.default);
            }

            responseJson.statut = true;
            responseJson.message = 'Mot de passe réinitialiser avec success';
            res.status(200).json(responseJson)
            return

        } catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error))
            return
        }
    }

    static async editPassword(req: Request, res: Response) : Promise<void> {
        const responseJson = {...apiHelpers.DEFAULT_RESPONSE_JSON}
        try {
            // Valider les données envoyées
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                responseJson.statut = false
                responseJson.message = Messengers.error.general.default
                responseJson.errors = Sanitizer.arrayToKeyObject("path", errors.array() as [])
                res.status(400).json(responseJson)
                return
            }
            const data = matchedData(req);
            const user_id = req.headers.auth_user
            const user_pwd = await UserModel.findOne({ where: { id: user_id },attributes: ['password'] });
            const user_pwd_ = user_pwd?.get()

            const isPasswordMatch = await BcryptCheck(data.old_password, user_pwd_?.password as string)
            if (!isPasswordMatch) {
                throw new Error("__messageFormatted__old_password__" + Messengers.error.password.incorrect)
            }

            if (data.new_password === data.old_password) {
                throw new Error("__messageFormatted__new_password__" + "Le nouveau mot de passe doit différent de l'ancien mot de passe.")
            }

            // Début de la transaction
            await UserModel.update({
                password: await BcryptMake(data.new_password)
            }, {
                where: {
                    id: user_id
                }
            })

            // Validation de la transaction
            responseJson.statut = true
            responseJson.message = 'Mot de passe mis à jour avec success'
            res.status(200).json(responseJson)
            return

        }catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error));
        }
    }
}