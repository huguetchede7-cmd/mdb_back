import { initializeMailTransporter } from '../../config/mailer'
import { emailDefaultTemplate } from '../ressources/email_template/emailDefaultTemplate'
import { EmailWelcomeTemplate } from '../ressources/email_template/emailWelcomeTemplate'
import { EmailPasswordResetTemplate } from '../ressources/email_template/emailPasswordResetTemplate'
import { EmailLogModel } from '../../models/EmailLogModel'
import moment from 'moment'
import { EmailPasswordResetSuccessTemplate } from '../ressources/email_template/emailPasswordResetSucceTemplate'
import { EmailWelcomeBusinessTemplate } from '../ressources/email_template/emailWelcomeBusinessTemplate'
import { EmailWelcomeClientTemplate } from '../ressources/email_template/clients/emailWelcomeClientTemplate'
import { EmailContactUsTemplate } from '../ressources/email_template/emailContactUs'
import { EmailOrderClientTemplate } from '../ressources/email_template/clients/emailOrderClientTemplate'
import { LogHelpers } from './LogHelpers'
import { ContactEmailDataType } from '../../types/ContactEmailDataType'
import { EmailWelcomeNewsletter } from '../ressources/email_template/emailWelcomeNewsletter'
import { emailWelcomeTemplateWithEmailValidation } from '../ressources/email_template/emailWelcomeTemplateWithEmailValidation'
import { emailClientAppointmentBooked } from '../ressources/email_template/clients/appointment/emailClientAppointmentBooked'
import { EmailAdminAppointmentNew } from '../ressources/email_template/admin/emailAdminAppointmentNew'
import { EmailClientAppointmentConfirmation } from '../ressources/email_template/clients/appointment/emailClientAppointmentUpdateDate'
import { EmailAdminAppointmentUpdate } from '../ressources/email_template/admin/emailAdminAppointmentUpdate'
import { emailClientAppointmentTerminated } from '../ressources/email_template/clients/appointment/emailClientAppointmentTerminated'
import { EmailClientAppointmentCanceled } from '../ressources/email_template/clients/appointment/emailClientAppointmentCanceled'
import {EmailClientOrderStatusChanged}from '../ressources/email_template/clients/orders/EmailClientOrderStatusChanged'
import { emailClientAppointmentRemind } from '../ressources/email_template/clients/appointment/emailClientAppointmentBookedRemind'
import { EmailWelcomeTemplateForNewUser } from '../ressources/email_template/clients/EmailWelcomeTemplateForNewUser'
import { emailCommentApprovedToClient } from '../ressources/email_template/clients/CommentEmailToClient'

interface MailOptions {
  mailRef: string
  subject: string
  from?: string
  to: string
  html: string
  data: { [key: string]: unknown }
}

export class EmailHelpers {
  static TYPE_WELCOME = 'welcome'
  static TYPE_WELCOME_BUSINESS = 'welcome-business'
  static TYPE_DYNAMIC_NOTIFICATION = 'notification'
  static TYPE_VERIFICATION_CODE = 'verification-code'
  static TYPE_RESET_PASSWORD = 'reset-password'
  static TYPE_RESET_PASSWORD_SUCCESSFUL = 'reset-password-successful'
  static TYPE_WELCOME_WITH_VERIFICATION_LINK = 'welcome_with_validate_email'
  static TYPE_WELCOME_NEW_CLIENT = 'welcome_new_client'
  static DEMO = 'demoTemplate'
  static TYPE_WELCOME_CLIENT = 'welcome-client'
  static TYPE_CONTACT_US = 'contact-us'
  static TYPE_BUSINESS_NEW_ADS_CREATE = 'new-business-ads-create'
  static TYPE_CLIENT_ORDER = 'order-client'
  static TYPE_NEWSLETTER_SUBSCRIBE = 'newsletter-subscribe'
  static TYPE_APPOINTMENT_BOOKED = 'appointment-booked'
  static TYPE_APPOINTMENT_BOOKED_STORE = 'appointment-booked-store'
  static TYPE_APPOINTMENT_BOOKED_REPROGRAMMED = 'appointment-booked-reprogrammed'
  static TYPE_APPOINTMENT_BOOKED_REPROGRAMMED_STORE = 'appointment-booked-reprogrammed-store'
  static TYPE_APPOINTMENT_COMPLETED = 'appointment-completed'
  static TYPE_APPOINTMENT_CANCELLED = 'appointment-cancelled'

  static TYPE_CLIENT_ORDER_VALIDETED ='client-order-validated'
  static TYPE_ADMIN_NOTIF_NEW_ORDER ='admin-notif-new-order'
  static TYPE_CLIENT_ORDER_STATUS_CHANGED ='client-order-status-changed'

  static TYPE_APPOINTMENT_REMIND = 'appointment-remind'

  static TYPE_APPROVED_OR_REJECTED_COMMENT = 'approved-comment'

  static EMAIL_TYPES = [
    EmailHelpers.TYPE_DYNAMIC_NOTIFICATION,
    EmailHelpers.TYPE_WELCOME,
    EmailHelpers.TYPE_WELCOME_BUSINESS,
    EmailHelpers.TYPE_VERIFICATION_CODE,
    EmailHelpers.TYPE_RESET_PASSWORD,
    EmailHelpers.DEMO,
    EmailHelpers.TYPE_WELCOME_WITH_VERIFICATION_LINK,
    EmailHelpers.TYPE_WELCOME_NEW_CLIENT,
    EmailHelpers.TYPE_WELCOME_CLIENT,
    EmailHelpers.TYPE_BUSINESS_NEW_ADS_CREATE,
    EmailHelpers.TYPE_CONTACT_US,
    EmailHelpers.TYPE_CLIENT_ORDER,
    EmailHelpers.TYPE_NEWSLETTER_SUBSCRIBE,
    EmailHelpers.TYPE_APPOINTMENT_BOOKED,
    EmailHelpers.TYPE_APPOINTMENT_BOOKED_STORE,
    EmailHelpers.TYPE_APPOINTMENT_BOOKED_REPROGRAMMED,
    EmailHelpers.TYPE_APPOINTMENT_BOOKED_REPROGRAMMED_STORE,
    EmailHelpers.TYPE_APPOINTMENT_COMPLETED,
    EmailHelpers.TYPE_APPOINTMENT_CANCELLED,
    EmailHelpers.TYPE_CLIENT_ORDER_VALIDETED,
    EmailHelpers.TYPE_ADMIN_NOTIF_NEW_ORDER,
    EmailHelpers.TYPE_CLIENT_ORDER_STATUS_CHANGED,

    EmailHelpers.TYPE_APPOINTMENT_REMIND,
    EmailHelpers.TYPE_APPROVED_OR_REJECTED_COMMENT
  ]

  // Méthode pour envoyer un email
  static async send(mailOptions: MailOptions): Promise<boolean> {
    try {
      const nowDate = moment().format('YYYY-MM-DD HH:mm:ss')
      // Sauvegarder dans la base de données
      await EmailLogModel.create({
        ref: mailOptions.mailRef,
        subject: mailOptions.subject,
        from: `${process.env.APP_NAME} <${process.env.MAIL_USERNAME}>`,
        to: mailOptions.to,
        data: JSON.stringify(mailOptions.data),
        template: mailOptions.data.mailType,
        created_at: nowDate,
        updated_at: nowDate
      })

      const MailTransporter = await initializeMailTransporter()
      if (!MailTransporter) {
        console.error('Le transporteur de mail n’a pas pu être initialisé.')
        return false
      }

      const sendEmailWithStatut = (): Promise<boolean> => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
          MailTransporter?.sendMail(
            {
              ...mailOptions,
              from: `${process.env.APP_NAME} <${process.env.MAIL_USERNAME}>`
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (error, info) => {
              if (error) {
                console.error('Error sending mail:', error)
                return resolve(false)
              }
              return resolve(true)
            }
          )
        })
      }

      return await sendEmailWithStatut()
    } catch (error) {
      LogHelpers.showException(error as Error)
      return false
    }
  }

  // Méthode pour construire le contenu de l'email
  static buildContent(originalData: { [key: string]: unknown }): string {
    const data = originalData

    if (!data?.image) {
      data.image = `${process.env.AWS_S3_BUCKET_PREFIX}/${process.env.APP_LOGO_MAIL ?? process.env.APP_LOGO}`
    }

    if (!originalData.year) {
      data.year = new Date().getFullYear()
    }

    if (!originalData.plateformName) {
      data.plateformName = process.env.APP_NAME
    }

    data.facebook = process.env.SOCIAL_MEDIA_APP_FACEBOOK
    data.instagram = process.env.SOCIAL_MEDIA_APP_INSTAGRAM
    data.tiktok = process.env.SOCIAL_MEDIA_APP_TIKTOK

    switch (data.mailType) {
      case EmailHelpers.TYPE_WELCOME:
        return EmailWelcomeTemplate(data)

      case EmailHelpers.TYPE_WELCOME_WITH_VERIFICATION_LINK:
        return emailWelcomeTemplateWithEmailValidation(data)

      //******Old email templates */
      case EmailHelpers.TYPE_WELCOME_BUSINESS:
        return EmailWelcomeBusinessTemplate(data)

      case EmailHelpers.TYPE_RESET_PASSWORD:
        return EmailPasswordResetTemplate(data)

      case EmailHelpers.TYPE_DYNAMIC_NOTIFICATION:
        return emailDefaultTemplate(data)

      case EmailHelpers.TYPE_RESET_PASSWORD_SUCCESSFUL:
        return EmailPasswordResetSuccessTemplate(data)

      case EmailHelpers.TYPE_WELCOME_CLIENT:
        return EmailWelcomeClientTemplate(data)

      case EmailHelpers.TYPE_CONTACT_US:
        return EmailContactUsTemplate(data as unknown as ContactEmailDataType)

      case EmailHelpers.TYPE_CLIENT_ORDER:
        return EmailOrderClientTemplate(data)

      case EmailHelpers.TYPE_NEWSLETTER_SUBSCRIBE:
        return EmailWelcomeNewsletter(data)

      case EmailHelpers.TYPE_APPOINTMENT_BOOKED:
        return emailClientAppointmentBooked(data)

      case EmailHelpers.TYPE_APPOINTMENT_BOOKED_STORE:
        return EmailAdminAppointmentNew(data)

      case EmailHelpers.TYPE_APPOINTMENT_BOOKED_REPROGRAMMED:
        return EmailClientAppointmentConfirmation(data)

      case EmailHelpers.TYPE_APPOINTMENT_BOOKED_REPROGRAMMED_STORE:
        return EmailAdminAppointmentUpdate(data)

      case EmailHelpers.TYPE_APPOINTMENT_COMPLETED:
        return emailClientAppointmentTerminated(data)

      case EmailHelpers.TYPE_APPOINTMENT_CANCELLED:
        return EmailClientAppointmentCanceled(data)

      case EmailHelpers.TYPE_CLIENT_ORDER_STATUS_CHANGED:
        return EmailClientOrderStatusChanged(data)

      case EmailHelpers.TYPE_WELCOME_NEW_CLIENT:
        return EmailWelcomeTemplateForNewUser(data)

      case EmailHelpers.TYPE_APPOINTMENT_REMIND:
        return emailClientAppointmentRemind(data)

      case EmailHelpers.TYPE_APPROVED_OR_REJECTED_COMMENT:
        return emailCommentApprovedToClient(data)

      default:
        return ''
    }
  }
}