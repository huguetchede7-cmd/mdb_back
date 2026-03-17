interface EmailData {
    image?: string;
    plateformName?: string;
    year?: number;
    fullname ?: string
}

export const EmailWelcomeBusinessTemplate = (data: EmailData) => {
    return `<!DOCTYPE html>
                <html>
                <head>
                </head>
                <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f6f6f6;">
                    <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;padding: 20px;background-color: #ffffff;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <div class="header">
                        <img src="${data?.image}" style="height: 100px;max-width: 100%;border-radius: 5px 5px 0 0;" alt="Bienvenue">
                    </div>
                    <div class="content" style="padding: 7px;text-align: justify;">
                        <h1>Bienvenue sur  ${data?.plateformName ?? process.env.APP_NAME}</h1>
                        <p>Nous vous remercions d'avoir créé un compte sur notre plateforme. Nous avons bien reçu votre demande d'inscription, et votre compte est actuellement en attente de validation.</p>
                        <p>Nos équipes vérifient actuellement vos informations, et nous vous tiendrons informé dès que votre compte sera activé. Cela peut prendre un peu de temps, mais soyez assuré que nous mettons tout en œuvre pour que vous puissiez profiter de nos services dans les plus brefs délais.</p>
                        <p>Nous vous remercions de votre patience et de votre compréhension.</p>
                    </div>
                    <div class="footer" style="text-align: justify;padding: 10px 0;color: #888888;">
                        <p>&copy; ${data?.year}  ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.</p>
                    </div>
                    </div>
                </body>
            </html>`
}