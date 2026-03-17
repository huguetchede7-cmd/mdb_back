interface EmailData {
  image?: string;
  email?: string
  password?: string
  clientRef?: string
  plateformName?: string
  year?: number
}

import { AboutHelpers } from '../../../helpers/AboutHelpers';

export const EmailWelcomeTemplateForNewUser = (data: EmailData) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            padding: 10px !important;
          }
          .content {
            padding: 15px !important;
          }
          h1 {
            font-size: 24px !important;
          }
          p {
            font-size: 14px !important;
          }
        }
      </style>
    </head>

    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f6f6f6;">
        <tr>
          <td style="padding: 20px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

              <tr>
                <td style="text-align: center; padding: 20px;">
                  <img src="${data.image}" style="height: 100px; max-width: 100%; border-radius: 5px;" alt="Bienvenue">
                </td>
              </tr>

              <tr>
                <td style="padding: 20px;">
                   <h1 style="color: #333333; margin: 0 0 20px; font-size: 28px; text-align: center;">Bienvenue chez ${data?.plateformName ?? process.env.APP_NAME} 🎉</h1>
                   <p style="color: #666666; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Nous sommes ravis de vous accueillir chez le leader du marché de l'optique. Notre mission reflète notre engagement depuis 1999 à rendre accessible des équipements optiques de qualité pour tous.</p>
                           
                  <div style="margin: 30px 0; background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                      <h2 style="color: #444; font-size: 20px; margin-bottom: 20px; text-align: center;">Notre Engagement</h2>
                      <div style="display: inline-block; width: 28%; margin: 10px; vertical-align: top; text-align: center;" class="feature">
                          <img src="https://oho-stockage.s3.eu-north-1.amazonaws.com/hand-stars.png" alt="Innovation" style="width: 64px; height: 64px; margin-bottom: 10px;">
                          <h3 style="color: #555; font-size: 16px;">Innovation</h3>
                          <p style="color: #777; font-size: 14px;">Des offres commerciales inédites pour tous les budgets</p>
                      </div><div style="display: inline-block; width: 27%; margin: 10px; vertical-align: top; text-align: center;" class="feature">
                          <img src="https://oho-stockage.s3.eu-north-1.amazonaws.com/diploma.png" alt="Expertise" style="width: 64px; height: 64px; margin-bottom: 10px;">
                          <h3 style="color: #555; font-size: 16px;">Expertise</h3>
                          <p style="color: #777; font-size: 14px;">${AboutHelpers.getExperienceYears()} ans d'expérience avec une équipe qualifiée</p>
                      </div><div style="display: inline-block; width: 25%; margin: 10px; vertical-align: top; text-align: center;" class="feature">
                          <img src="https://oho-stockage.s3.eu-north-1.amazonaws.com/delivery.png" alt="Proximité" style="width: 64px; height: 64px; margin-bottom: 10px;">
                          <h3 style="color: #555; font-size: 16px;">Proximité</h3>
                          <p style="color: #777; font-size: 14px;">${AboutHelpers.getShopsCount()} points de vente pour être au plus près de vous</p>
                      </div>
                  </div>  
                         
                  <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                    Un compte a été créé pour vous par notre équipe.  
                    Vous pouvez dès maintenant accéder à votre espace personnel.
                  </p>

                  <div style="margin: 30px 0; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #444; font-size: 20px; margin-bottom: 15px;">
                      Vos identifiants de connexion
                    </h2>

                    <p style="color: #555; font-size: 15px; margin: 5px 0;">
                      <strong>Email :</strong> ${data.email}
                    </p>

                    <p style="color: #555; font-size: 15px; margin: 5px 0;">
                      <strong>Mot de passe :</strong> ${data.password}
                    </p>

                    <p style="color: #555; font-size: 15px; margin: 5px 0;">
                      <strong>Code client :</strong> ${data.clientRef}
                    </p>
                  </div>

                  <p style="color: #666666; font-size: 15px; line-height: 1.5;">
                    ⚠️ Pour des raisons de sécurité, nous vous recommandons fortement de
                    <strong>changer votre mot de passe dès votre première connexion</strong>.
                  </p>

                  <p style="color: #888888; font-size: 14px; font-style: italic; margin-top: 20px;">
                    Si vous n'êtes pas à l'origine de cette création de compte, veuillez contacter notre support.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #888888; font-size: 14px; margin: 0;">
                    &copy; ${data.year ?? new Date().getFullYear()} ${data.plateformName ?? process.env.APP_NAME}. Tous droits réservés.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
}
