interface EmailData {
    image?: string;
    plateformName?: string;
    year?: number;
}

import { AboutHelpers } from '../../helpers/AboutHelpers';

export const EmailWelcomeTemplate = (data: EmailData) => {
    return `<!DOCTYPE html>
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
                            .feature {
                                width: 100% !important;
                            }
                        }
                    </style>
                </head>
                <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f6f6f6;">
                    <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;padding: 20px;background-color: #ffffff;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <div class="header" style="text-align: center;">
                            <img src="${data?.image}" style="height: 100px; max-width: 100%; border-radius: 5px 5px 0 0;" alt="Bienvenue">
                        </div>
                        <div class="content" style="padding: 20px;text-align: center;">
                            <h1 style="color: #333;margin-bottom: 20px;">Bienvenue chez ${data?.plateformName ?? process.env.APP_NAME} 👋</h1>
                            <p style="color: #666;font-size: 16px;line-height: 1.5;margin-bottom: 25px;">Nous sommes ravis de vous accueillir chez le leader du marché de l'optique avec ${AboutHelpers.getExperienceYears()} ans d'expérience. Notre mission : "Votre Vision, Notre Mission" - parce que bien voir est un droit.</p>
                            
                            <div style="margin: 30px 0;background-color: #f9f9f9;padding: 20px;border-radius: 8px;">
                                <h2 style="color: #444;font-size: 20px;margin-bottom: 20px;">Notre Engagement</h2>
                                
                                <div style="display: inline-block;width: 30%;margin: 10px;vertical-align: top;" class="feature">
                                    <h3 style="color: #555;font-size: 16px;">Accessibilité</h3>
                                    <p style="color: #777;font-size: 14px;">Des équipements optiques de qualité pour toutes les bourses</p>
                                </div>
                                
                                <div style="display: inline-block;width: 30%;margin: 10px;vertical-align: top;" class="feature">
                                    <h3 style="color: #555;font-size: 16px;">Expertise</h3>
                                    <p style="color: #777;font-size: 14px;">Une équipe qualifiée avec ${AboutHelpers.getExperienceYears()} ans d'expérience</p>
                                </div>
                                
                                <div style="display: inline-block;width: 30%;margin: 10px;vertical-align: top;" class="feature">
                                    <h3 style="color: #555;font-size: 16px;">Proximité</h3>
                                    <p style="color: #777;font-size: 14px;">${AboutHelpers.getShopsCount()} points de vente pour être au plus près de vous</p>
                                </div>
                            </div>

                            <p style="color: #666;font-size: 16px;margin-top: 25px;">Depuis 1999, nous innovons pour vous offrir des solutions optiques adaptées à vos besoins. Venez comme vous êtes, notre priorité est votre vision !</p>
                        </div>
                        <div class="footer" style="text-align: center;padding: 20px 0;color: #888888;border-top: 1px solid #eee;">
                            <p>&copy; ${data?.year} ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
            </html>`
}