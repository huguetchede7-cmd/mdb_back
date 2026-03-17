interface EmailData {
    image?: string;
    plateformName?: string;
    year?: number;
    fullname ?:string
    order_num ?:string
    order_checkLink ?:string
}

export const EmailOrderClientTemplate = (data: EmailData) => {
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
                            <p>Bonjour ${data.fullname}, <br><br></p>  

                            <p>Votre commande <b>${data.order_num}</b> a été enregistrée avec succès.</p>  
                            
                            <p>Nous vous contacterons prochainement pour les détails de la livraison.</p>
                            <p><br>
                                Pour consultez votre commande, cliquer sur bouton ci-dessous: <br>
                                <a href="${data.order_checkLink}" style="display: inline-block; padding: 10px 15px; color: #fff; background: #007bff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                                    Suivre ma commande
                                <a>
                            </p>
                            <p><br>Si vous rencontrez des difficultes avec le bouton, veuillez directement cliquer sur ce lien: <br>
                             <a href="${data.order_checkLink}">${data.order_checkLink}</a>
                            </p>
                            
                            <p><br><br>Merci pour votre confiance !</p>
                            
                            <p>Cordialement</p>
                        </div>
                        <div class="footer" style="text-align: justify;padding: 10px 0;color: #888888;">
                            <p>&copy; ${data?.year}  ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.</p>
                        </div>
                        </div>
                    </body>
                </html>`
};