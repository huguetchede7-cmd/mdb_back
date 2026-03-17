interface EmailData {
    fullname?: string;
    image?: string;
    plateformName?: string;
    year?: number;
}

export const EmailPasswordResetSuccessTemplate = (data: EmailData) => {
    const currentYear = new Date().getFullYear();
    const platformName = data?.plateformName ?? process.env.APP_NAME ?? "Votre Plateforme";

    return `
  <!DOCTYPE html>
  <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6;">
          <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <div>
                  <img 
                      src="${data?.image ?? 'https://via.placeholder.com/100'}" 
                      alt="Logo de ${platformName}" 
                      style="height: 100px; max-width: 100%; border-radius: 5px 5px 0 0;"
                  />
              </div>
              <div style="padding: 7px; text-align: left;">
                  <h1 style="font-size: 24px; color: #333333;">Hello ${data.fullname ?? ''},</h1>
                  <p style="margin-top: 10px; color: #555555; font-size: 14px;">
                      Nous vous confirmons que le mot de passe de votre compte associé à cette adresse email a été modifié avec succès. </p>
                    <p style="margin-top: 10px; color: #555555; font-size: 14px;">
                      Si vous êtes à l'origine de ce changement, vous n'avez aucune autre action à effectuer.
                      Toutefois, si vous n'avez pas initié cette modification, veuillez nous en informer immédiatement.
                  </p>
              </div>
              <div style="padding: 10px 0; text-align: center; color: #888888; font-size: 12px;">
                  <p>&copy; ${data?.year ?? currentYear} ${platformName}. Tous droits réservés.</p>
              </div>
          </div>
      </body>
  </html>
  `;
};
