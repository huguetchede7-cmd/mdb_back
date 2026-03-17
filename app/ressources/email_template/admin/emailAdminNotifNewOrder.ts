import { OrderProductAttributes } from '../../../../models/OrderProductModel'
import { OrderDeliveryAttributes } from '../../../../models/OrderDeliveryModel'

interface EmailData {
  image?: string
  plateformName?: string
  fullname?: string
  order_reference?: string
  date?: string
  products?: OrderProductAttributes[]
  delivery?: OrderDeliveryAttributes
  total_normal?: number
  total_discount?: number
  total_final?: number
  tracking_link?: string
  facebook?: string
  instagram?: string
  tiktok?: string
}

export const EmailAdminNotifNewOrder = (data: EmailData) => {
  const renderProducts = (data.products ?? [])
    .map(
      (p) => `
        <tr style="border-top:1px solid #e5e7eb; white-space:nowrap;">
          <td style="padding:10px 12px; vertical-align:middle; text-align:left; display:flex; align-items:center;">
            <img src="${p.picture ?? 'https://via.placeholder.com/70'}"
                 alt="${p.name}"
                 width="30"
                 style="border-radius:8px; margin-right:8px; display:inline-block;">
            <div style="display:inline-block;">
              <div style="font-weight:600; color:#111827; font-size:10px;">${p.name}</div>
              ${
        p.offer_description
          ? `<div style="color:#059669; font-size:8px; margin-top:2px;">${p.offer_description}</div>`
          : ''
      }
            </div>
          </td>

          <td style="padding:10px 12px; text-align:center; vertical-align:middle; color:#374151; font-size:10px;">
            ${p.quantity ?? 1}
          </td>

          <td style="padding:10px 12px; text-align:right; vertical-align:middle; color:#374151; font-size:10px;">
            ${(p.unit_price ?? 0).toLocaleString()}
          </td>

          <td style="padding:10px 12px; text-align:right; vertical-align:middle; font-weight:600; color:#111827; font-size:12px;">
            ${(p.final_amount ?? 0).toLocaleString()}
          </td>
        </tr>
      `
    )
    .join('')

  const totalNormal = data.total_normal ?? 0
  const totalDiscount = data.total_discount ?? 0
  const totalFinal = data.total_final ?? 0
  const deliveryPrice = data.delivery?.price ?? 0
  const deliveryName = 'Frais de livraison'
  const totalWithDelivery = totalFinal + deliveryPrice

  return `
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Nouvelle commande reçue</title>
<style>
  body { margin:0; padding:0; background-color:#f5f5f7; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial; }
  table { border-collapse:collapse; width:100%; }
  img { border:0; display:block; }
  a { text-decoration:none; }
  @media only screen and (max-width:600px){
    .container { width:100% !important; padding:16px !important; }
  }
</style>
</head>
<body>
  <table width="100%" bgcolor="#f5f5f7" role="presentation">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table class="container" width="600" style="background-color:#ffffff; border-radius:10px; overflow:hidden;">
          
          <!-- HEADER -->
          <tr>
            <td align="center" style="background-color:#111827; padding:24px;">
              <img alt="${data.plateformName ?? process.env.APP_NAME}" 
                   src="${data.image}" 
                   width="100" style="border-radius:6px; margin-bottom:10px;" />
              <h1 style="font-size:22px; color:#ffffff; font-weight:700; margin:0;">
                Nouvelle commande reçue 📦
              </h1>
              <p style="color:#d1d5db; font-size:14px; margin:6px 0 0;">
                Une nouvelle commande vient d’être passée sur <b>${data.plateformName ?? 'votre boutique'}</b>.
              </p>
            </td>
          </tr>

          <!-- LIEN DE SUIVI -->
          ${
    data.tracking_link
      ? `
          <tr>
            <td style="padding:18px 32px; text-align:center;">
              <a href="${data.tracking_link}"
                 style="display:inline-block; background:#10b981; color:#fff; padding:12px 26px; border-radius:28px; font-weight:600; font-size:15px;">
                Voir la commande
              </a>
            </td>
          </tr>`
      : ''
  }

          <!-- DÉTAILS COMMANDE -->
          <tr>
            <td style="padding:0 24px 24px;">
              <table style="border:1px solid #e6e7eb; border-radius:8px; overflow:hidden; width:100%;">
                <tr>
                  <td style="padding:16px;">
                    <h2 style="margin:0 0 8px; font-size:18px; color:#0a0a0c;">Détails de la commande</h2>
                    <div style="color:#6b7280; font-size:13px; margin-bottom:14px;">
                      <strong>Client :</strong> ${data.fullname ?? ''}<br>
                      <strong>Référence :</strong> ${data.order_reference ?? ''}<br>
                      <strong>Date :</strong> ${data.date ?? ''}
                    </div>

                    <!-- TABLE SCROLLABLE -->
                    <div style="overflow-x:auto;">
                      <table role="presentation" style="border-collapse:collapse; min-width:500px; white-space:nowrap;">
                        <thead>
                          <tr style="background-color:#f9fafb; border-bottom:2px solid #e5e7eb;">
                            <th style="padding:10px 12px; text-align:left; color:#374151; font-size:13px;">Produit</th>
                            <th style="padding:10px 12px; text-align:center; color:#374151; font-size:13px;">Qté</th>
                            <th style="padding:10px 12px; text-align:right; color:#374151; font-size:13px;">PU</th>
                            <th style="padding:10px 12px; text-align:right; color:#374151; font-size:13px;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${renderProducts}
                        </tbody>
                      </table>
                    </div>

                    <!-- TOTAUX -->
                    <table width="100%" style="margin-top:16px; border-top:1px solid #f3f4f6; padding-top:12px;">
                     ${
                        data.delivery
                          ? `
                          <tr>
                            <td style="font-size:13px; color:#6b7280;">Lieu de livraison</td>
                            <td style="text-align:right; font-size:13px; color:#111827; font-weight:600;">
                             ${data.delivery.destination?? '-'}
                            </td>
                          </tr>
                          `
                          : ''
                      }
                      <tr>
                        <td style="font-size:13px; color:#6b7280;">Sous-total</td>
                        <td style="text-align:right; font-size:13px; color:#111827; font-weight:600;">
                          ${totalNormal.toLocaleString()} FCFA
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:13px; color:#6b7280;">Réduction</td>
                        <td style="text-align:right; font-size:13px; color:#ef4444; font-weight:600;">
                          -${totalDiscount.toLocaleString()} FCFA
                        </td>
                      </tr>
      
                      <tr>
                        <td style="font-size:13px; color:#6b7280;">${deliveryName}</td>
                        <td style="text-align:right; font-size:13px; color:#111827; font-weight:600;">
                          ${deliveryPrice.toLocaleString()} FCFA
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:14px; color:#111827; font-weight:700;">Total à payer</td>
                        <td style="text-align:right; font-size:14px; color:#10b981; font-weight:700;">
                          ${totalWithDelivery.toLocaleString()} FCFA
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="padding:25px 15px; background:#000000; color:#fff; text-align:center; font-size:12px;">
              <div>Nouvelle commande sur <b>${data.plateformName ?? process.env.APP_NAME}</b> 🛒</div>
              <div style="margin-top:10px;">Connectez-vous à votre tableau de bord pour la traiter.</div>
              <div style="margin-top:14px; text-align:center;">
                ${data.facebook ? `<a href="${data.facebook}" target="_blank" style="display:inline-block; margin:0 6px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" width="20"></a>` : ''}
                ${data.instagram ? `<a href="${data.instagram}" target="_blank" style="display:inline-block; margin:0 6px;"><img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" width="20"></a>` : ''}
                ${data.tiktok ? `<a href="${data.tiktok}" target="_blank" style="display:inline-block; margin:0 6px;"><img src="https://cdn-icons-png.flaticon.com/24/3046/3046120.png" width="20"></a>` : ''}
              </div>
              <div style="margin-top:16px; font-size:11px; color:#9ca3af;">
                © ${new Date().getFullYear()} ${data.plateformName ?? process.env.APP_NAME}. Tous droits réservés.
              </div>
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
