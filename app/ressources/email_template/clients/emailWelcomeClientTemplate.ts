interface EmailData {
    image?: string;
    plateformName?: string;
    year?: number;
    fullname ?:string
    siteLink ?:string | 'https://app-test.onyxmarketplaces.com/become-an-advertiser'
}

export const EmailWelcomeClientTemplate = (data: EmailData) => {
    return `<!DOCTYPE html>
                <html>
                <head>
                </head>
                <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f6f6f6;">
                    <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;padding: 20px;background-color: #ffffff;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <div class="header">
                        <img src="${data?.image}" style="height: 100px;max-width: 100%;border-radius: 5px 5px 0 0;" alt="Bienvenue">
                    </div>
                    <div class="content" style="padding: 20px;text-align: justify;">
                        <h3>Bonjour ${data.fullname},</h3>
                        <p>Vous avez rejoint ${data?.plateformName ?? process.env.APP_NAME}.</p>
                        <p>Nous sommes ravis de vous accueillir sur notre plateforme. Profitez de notre service.</p>
                        <p>Pour vous connecter, veuillez cliquer sur le lien ci-dessous modifier votre mot de passe : </p>
                        <a style="margin-bottom: 2px ; margin-top: 2px" href="${data.siteLink}">${data.siteLink}</a>
                        <p>Vous pouvez maintenant constulter et faire des achats de votre choix sur notre plateforme en un seul clic.</p>
                        <p>Si vous avez des questions ou besoin d'assistance, notre equipe est a votre disposition pour vous aider.</p>
                        <p>Cordialement,</p>
                    </div>
                    <div class="footer" style="text-align: justify;padding: 10px 0;color: #888888;">
                        <p>&copy; ${data?.year}  ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.</p>
                    </div>
                    </div>
                </body>
            </html>`
};