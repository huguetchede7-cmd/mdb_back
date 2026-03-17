interface EmailData {
    resetLink?: string
    image?: string;
    plateformName?: string;
    fullname ?: string;
    year?: number;
}

export const EmailPasswordResetTemplate = (data: EmailData) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
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
        <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f6f6f6;">
            <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;padding: 20px;background-color: #ffffff;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div class="header" >
                    <img src="${data?.image}" style="height: 100px;max-width: 100%;border-radius: 5px 5px 0 0;" alt="Bienvenue">
                </div>
                <div class="content">
                    <h1>Cher ${data?.fullname ?? process.env.APP_NAME}</h1>
                    <p>Nous avons reçu votre demande de réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour terminer la réinitialisation.</p>
                    <div style="margin-top: 20px;">
                        <p style="word-break: break-word;color: #007BFF;">
                            <a href="${data?.resetLink}">${data?.resetLink}</a>
                        </p>
                        <p style="margin-top: 10px;color: #555555;font-size: 14px;">Ce lien est valable pour une seule utilisation et expire dans 10 minutes.<br>Si vous n'avez pas faire une demande de rénitialisation de mot de passe sur ${data?.plateformName ?? process.env.APP_NAME}, veuillez ignorer ce message.</p>
                    </div>
                </div>
                <div class="footer" style="padding: 10px 0;color: #888888;">
                    <p>&copy; ${data?.year} ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.</p>
                </div>
            </div>
        </body>
    </html>
`}