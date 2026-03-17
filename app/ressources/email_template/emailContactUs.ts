import { ContactEmailDataType } from '../../../types/ContactEmailDataType'

export const EmailContactUsTemplate = (data: ContactEmailDataType) => {
  return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle demande de contact</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f8f8; min-height: 100vh;">
            <div style="width: 100%; max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); overflow: hidden; border: 1px solid #e5e5e5;">
                
                <!-- Header -->
                <div style="background-color: #000000; padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                         Nouvelle demande de contact
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">
                        Une personne souhaite vous contacter
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <div style="margin-bottom: 30px;">
                        <div style="display: inline-block; background-color: #f5f5f5; padding: 3px 12px; border-radius: 20px; font-size: 14px; color: #666666; font-weight: 500; margin-bottom: 20px; border: 1px solid #e0e0e0;">
                            ${data.service ?? 'Service non spécifié'}
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <div style="background-color: #fafafa; border-left: 4px solid #000000; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <div style="display: grid; gap: 15px;">
                                <div>
                                    <span style="font-weight: 600; color: #333333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Nom complet</span>
                                    <p style="margin: 5px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">
                                        ${data.fullname ?? 'Non renseigné'}
                                    </p>
                                </div>
                                
                                <div>
                                    <span style="font-weight: 600; color: #333333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                                    <p style="margin: 5px 0 0 0;">
                                        <a href="mailto:${data.email}" style="color: #000000; text-decoration: underline; font-size: 16px; font-weight: 500;">
                                            ${data.email ?? 'Non renseigné'}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <span style="font-weight: 600; color: #333333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: block;">Message</span>
                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; padding: 20px; border-radius: 12px; line-height: 1.6; color: #333333; font-size: 15px;">
                            ${data.message ? data.message.replace(/\n/g, '<br>') : 'Aucun message fourni'}
                        </div>
                    </div>

                    <div style="background-color: #f5f5f5; border-left: 4px solid #666666; padding: 16px 20px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 0; color: #333333; font-size: 14px; font-weight: 500;">
                            <strong>Action requise :</strong> Merci de répondre à cette demande dans les plus brefs délais.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafafa; text-align: center; padding: 25px 20px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #666666; font-size: 13px;">
                        © ${new Date().getFullYear()} Votre Plateforme • Tous droits réservés
                    </p>
                </div>
            </div>
        </body>
    </html>`
}