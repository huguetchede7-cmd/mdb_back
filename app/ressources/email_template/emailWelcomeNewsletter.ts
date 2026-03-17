interface EmailData {
    image?: string;
    plateformName?: string;
    year?: number;
}

export const EmailWelcomeNewsletter = (data: EmailData) => {
    const mainImgUrl = "https://oho-stockage.s3.eu-north-1.amazonaws.com/1757331239512-8dbf9edb-5462-4645-8f6d-a2d3147bcd9c.png"
    const facebookImgUrl = "https://ci3.googleusercontent.com/meips/ADKq_NYjXxejNPG-g3zdqRgSQYXXqYK-UGcJ8-5_6zVJ4mNmfLXrMZETFMNkDIgqRP9ZonAXno8h-mqnY8cw80fVGo4syaJa1XNLCovDGj2pQwBTxF4AWPwLgJNJt4AW9Q=s0-d-e1-ft#https://rwa.soundestlink.com/dynamicImage/social/facebook/48/24/default"
    const instagramImgUrl = "https://ci3.googleusercontent.com/meips/ADKq_NbZujl9A1deUS27ttIIk_ooUwukIhcPY_BTLasqW7faGhD1iwJPamd5270g-TxRuy23EQbhH6JF4tR9uZz_Rf8gF-7fADEXwvEa9NpaImfS_lcSaFE0I0rHF_OaGm0=s0-d-e1-ft#https://rwa.soundestlink.com/dynamicImage/social/instagram/48/24/default"
    const tiktokImgUrl = "https://ci3.googleusercontent.com/meips/ADKq_NZNXsJlUKmoyNPJOaZMYvNNmjrh6VtV3lgOXshuuwoKSIYD6nLGhrl49z81InWbRk7DYgo0v-AAPTEMsDxH4JzZFCYdw47cGvtmS09cT-F238_fVLJIVrvGlx0=s0-d-e1-ft#https://rwa.soundestlink.com/dynamicImage/social/tiktok/48/24/default"
    const footerImgUrl = "https://oho-stockage.s3.eu-north-1.amazonaws.com/1757331780099-1fe9756c-b1ea-45c1-8459-77299cdfd99c.png"
    
    return `
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
    <table width="100%" height="100%" style="background-color:#e3e5e8">
      <tr>
        <td>
          <table width="600" style="margin:0 auto;background-color:#fff;max-width:100%">
            <tr>
              <td style="padding:24px;background-color:#fff">
                <table width="100%">
                  <tr>
                    <td style="text-align:center">
                      <img width="528" height="251" src="${mainImgUrl}" style="max-width:100%;height:auto">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 24px;background-color:#fff">
                <h1 style="font-size:28px;margin:0;font-weight:700">Bienvenue à notre newsletter !</h1>
                
                <p style="font-size:14px;line-height:1.6;margin:16px 0">
                  Merci de vous être inscrit à notre newsletter. Nous sommes ravis de vous compter parmi nos abonnés et nous nous engageons à vous tenir informé des dernières actualités, offres spéciales et nouveautés de ${data?.plateformName ?? process.env.APP_NAME}.
                </p>

                <p style="font-size:14px;line-height:1.6">En tant qu'abonné, vous bénéficierez :</p>
                <ul style="font-size:14px;line-height:1.6">
                  <li>🎁 Des offres exclusives réservées à nos abonnés</li>
                  <li>📢 Des actualités sur nos nouveaux produits et services</li>
                  <li>💡 Des conseils et astuces pour prendre soin de votre vue</li>
                </ul>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;background-color:#000;color:#fff">
                <div style="text-align:center;margin-bottom:24px">
                  <a href="https://web.facebook.com/oholeslunettes" style="margin:0 12px"><img width="24" alt="facebook" src="${facebookImgUrl}"></a>
                  <a href="https://www.instagram.com/oholeslunettes" style="margin:0 12px"><img width="24" alt="instagram" src="${instagramImgUrl}"></a>
                  <a href="https://www.tiktok.com/@oho_les_lunettes" style="margin:0 12px"><img width="24" alt="tiktok" src="${tiktokImgUrl}"></a>
                </div>
                <p style="font-size:14px;margin:12px 0">© ${data?.year} ${data?.plateformName ?? process.env.APP_NAME}</p>
                
                <p style="font-size:14px;margin:12px 0;line-height:1.6">
                  Du Pont, 4ème rue à Gauche dans la rue Bel Air en venant de l'avenue, Cotonou, Bénin, 00229<br>
                  Cet e-mail a été envoyé car vous avez souscrit à notre newsletter.
                </p>

                <div style="text-align:center;margin:24px 0">
                  <img src="${footerImgUrl}" alt="footer image" style="max-width:200px;height:auto">
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    </body>`
}