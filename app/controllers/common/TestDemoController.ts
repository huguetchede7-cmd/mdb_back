import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import FileHelpers from '../../helpers/fileHelpers'
import { UploadedFile } from 'express-fileupload'
import { addEmailJob } from '../../../config/queue'
import AppointmentModel from '../../../models/AppointmentModel'
import { AppointmentsHelpers } from '../../helpers/AppointmentsHelpers'
import { EmailHelpers } from '../../helpers/EmailHelpers'
// import OrderProductModel from '../../../models/OrderProductModel'
import UserModel from '../../../models/UserModel'
import OrderModel from '../../../models/OrderModel'
import OrderStatusModel from '../../../models/OrderStatusModel'
import { OrderStatus } from '../../constants/order-status'
import ProfilClientAppController from '../client/ProfilClientAppController'


export class TestDemoController {

  static async testUpload(req: Request, res: Response): Promise<void> {
    try {
       let fileUpload = null;
      // Suppossons qu'on soumis une photo dans un formulaire dont l'input file à le name="photo"
      if (!req.files?.photo) {
        throw new Error('__messageFormatted__Fichier non soumis')
      }

      // Enregistrer le fichier
      if (req.body?.format == "avif") {
        fileUpload = await FileHelpers.saveAsAvif(req.files.photo as UploadedFile)
      } else {
        fileUpload = await FileHelpers.save(req.files.photo as UploadedFile)
      }

      if (!fileUpload) {
        throw new Error('__messageFormatted__Erreur lors de la sauvegarde de fichier')
      }

      res.status(200).json({ fileName: fileUpload, publicUrl: process.env.AWS_S3_BUCKET_PREFIX + '/' + fileUpload })
      return
    } catch (err) {
      res.status(400).json(apiHelpers.bindError(err as Error))
      return
    }
  }


  static async testEmailQueue(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body


      if (!data.reference) {
        throw new Error('Référence du rendez-vous non trouvée');
      }

      const appointment = await AppointmentModel.findOne({
          where: {
              reference: data.reference,
          }
      });

      if (!appointment) {
          throw new Error('Rendez-vous non trouvé');
      }

      const appointmentDetail = await AppointmentsHelpers.format(appointment);

        // Send mail to client
      await addEmailJob('appointment_booked', {
          email: appointmentDetail?.user.email ?? '',
          object: 'Rendez-vous confirmé',
          emailData: {
              mailRef: appointmentDetail?.appointment.reference ?? '',
              mailType: EmailHelpers.TYPE_APPOINTMENT_BOOKED,
              fullname : `${appointmentDetail?.user.lastname ?? ''} ${appointmentDetail?.user.firstname ?? ''}`,
              service : appointmentDetail?.service.name ?? '',
              magasin : `${appointmentDetail?.store.name} (${appointmentDetail?.store.address})`,
              montant : appointmentDetail?.service.price ?? '',
              phone : appointmentDetail?.user.phone ?? '',
              appointment_num : appointmentDetail?.appointment.reference ?? '',
          }
      }, { delay: 5000 })

      res.status(200).json({ message: 'Emails envoyés avec succès' })
      return
    } catch (err) {
      res.status(400).json(apiHelpers.bindError(err as Error))
      return
    }
  }

  static async testEmailSend(req: Request, res: Response): Promise<void> {
    try {
      const data = req.query as { email: string }

      if (!data.email) {
        throw new Error('Email non trouvé');
      }

      // const products_ = await OrderProductModel.findAll({where:{order_id:1}})

      // await addEmailJob('client_order_validated', {
      //     email: data.email,
      //     object: '👓✅ Votre commande a été enregistrée avec succès',
      //     emailData: {
      //       image:`https://oho-stockage.s3.eu-north-1.amazonaws.com/${process.env.APP_LOGO}`,
      //       mailRef: "1234567890",
      //       mailType:EmailHelpers.TYPE_CLIENT_ORDER_VALIDETED,
      //       fullname: "Cedric Dekoun",
      //       order_reference: "1234567890",
      //       date : new Date().toLocaleString('fr-FR', {
      //         year: 'numeric',
      //         month: '2-digit',
      //         day: '2-digit',
      //         hour: '2-digit',
      //         minute: '2-digit',
      //         hour12: false
      //       }).replace(',', ' à'),
      //       products: products_.map((p) => p.get()),
      //       delivery: {
      //         order_id: 1,
      //         price: 10000,
      //         from: "Yaoundé",
      //         destination: "Douala De la Rue la Brocante",
      //         completed_at: new Date(),
      //       },
      //       total_normal: 200000,
      //       total_discount: 100000,
      //       total_final: 100000,
      //     }
      //   }, { delay: 5000 });


      // Récupération de la commande avec le statut actuel
      const order = await OrderModel.findOne({
        where: { reference: "CD-26-1761437502002" },
        include: [
          {
            model: OrderStatusModel,
            as: 'order_status',
            attributes: ['id', 'label']
          },
        ]
      });

      const orderUser = await UserModel.findByPk(Number(order?.get().user_id));
      const userDetail = orderUser?.get()
      const orderDetail = order?.get()
      const newStatus = await OrderStatusModel.findByPk(OrderStatus.delivered_check);

      if (!orderDetail) {
        throw new Error('Commande non trouvée');
      }

      if (!newStatus) {
        throw new Error('Statut non trouvé');
      }

      await addEmailJob('client_order_status_changed', {
          email: data.email ?? "",
          object: `🔔 Suivi de votre commande #${orderDetail?.reference ?? ""}`,
          emailData: {
            image: `https://oho-stockage.s3.eu-north-1.amazonaws.com/${process.env.APP_LOGO}`,
            mailRef: orderDetail?.reference ?? "",
            mailType: EmailHelpers.TYPE_CLIENT_ORDER_STATUS_CHANGED,
            fullname: userDetail?.fullname ?? "",
            order_reference: orderDetail?.reference ?? "",
            status_label: newStatus?.get().label ?? "",
            status_slug: newStatus?.get().slug ?? "",
            total_normal: orderDetail?.amount ?? 0,
            total_discount: orderDetail?.discount ?? 0,
            total_final: orderDetail?.total_amount ?? 0,
            facebook: process.env.FACEBOOK_URL,
            instagram: process.env.INSTAGRAM_URL,
            tiktok: process.env.TIKTOK_URL
          },
        }, { delay: 5000 })

      res.status(200).json({ message: 'Email envoyé avec succès' })
      return
    } catch (err) {
      res.status(400).json(apiHelpers.bindError(err as Error))
      return
    }
  }


  static async getSheetByCode(req: Request, res: Response): Promise<void> {
    try {
      const data = req.query as { code: string }

      if (!data.code) {
        throw new Error('Code invalide');
      }

      res.status(200).json({ message: 'Get Sheet Detail', data: await ProfilClientAppController.getClientRecordsByCode(data.code) })
      return
    } catch (err) {
      res.status(400).json(apiHelpers.bindError(err as Error))
      return
    }
  }
}
