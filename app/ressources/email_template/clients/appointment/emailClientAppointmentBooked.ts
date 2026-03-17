import { formatDateHelpers } from "../../../../helpers/DateHelpers";

interface EmailData {
    image?: string;
    plateformName?: string;
    fullname ?:string
    service ?:string
    date ?:string
    magasin ?:string
    montant ?:string
    facebook ?:string
    instagram ?:string
    tiktok ?:string
    appointment_num ?:string
    notes ?:string
}

export const emailClientAppointmentBooked = (data: EmailData) => {
    return `<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Confirmation de Rendez-vous - ${data?.plateformName ?? process.env.APP_NAME}</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f0f0f0; color:#000;">

  <!-- Container -->
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px;">

    <!-- Header -->
    <div style="padding-bottom:20px; text-align:center;">
      <img src="${data?.image}" alt="${data?.plateformName ?? process.env.APP_NAME}" style="max-width:120px; margin-bottom:10px;">
      <div style="font-size:22px; font-weight:bold; margin:10px 0;">Confirmation de votre rendez-vous</div>
    </div>

    <!-- Reference Number Highlight -->
    <div style="background-color:#f8f9fa; border:2px solid #000; border-radius:8px; padding:20px; margin:20px 0; text-align:center;">
      <div style="font-size:16px; color:#666; margin-bottom:5px;">Votre numéro de rendez-vous</div>
      <div style="font-size:20px; font-weight:bold; color:#000; letter-spacing:1px;">${data?.appointment_num}</div>
      <div style="font-size:14px; color:#666; margin-top:5px;">Conservez ce numéro précieusement</div>
    </div>

    <!-- Message -->
    <div style="margin:20px 0; font-size:15px; line-height:1.7;">
      Bonjour,<br><br>
      Nous avons le plaisir de vous confirmer votre rendez-vous pour le service <b>${data?.service}</b>.  
      Celui-ci est programmé pour le <b>${data?.date ? formatDateHelpers(data.date) : ""}</b> dans notre magasin <b>${data?.magasin}</b>.  
      <br><br>
      Nous vous remercions pour la confiance que vous accordez à <b>${data?.plateformName ?? process.env.APP_NAME}</b>.  
      Ce rendez-vous nous permettra de vous offrir la meilleure expérience possible, avec toute l'attention et le professionnalisme que mérite votre confort visuel.
    </div>

    <!-- Recap -->
    <div style="margin:25px 0;">
      <table style="width:100%; font-size:15px; border-collapse:collapse;">
        <tbody>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="width:35%; padding:10px 0; font-weight:bold;">N° de rendez-vous</th>
            <td style="padding:10px 5px;">${data?.appointment_num}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="width:35%; padding:10px 0; font-weight:bold;">Service</th>
            <td style="padding:10px 5px;">${data?.service}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Magasin</th>
            <td style="padding:10px 5px;">${data?.magasin}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Date</th>
            <td style="padding:10px 5px;">${data?.date ? formatDateHelpers(data.date) : ""}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Montant</th>
            <td style="padding:10px 5px;">${data?.montant}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Notes</th>
            <td style="padding:10px 5px;">${data?.notes}</td>
          </tr>
          <tr>
            <th align="left" style="padding:10px 0; font-weight:bold;">Statut</th>
            <td style="padding:10px 5px; color: #34A853">Réservée avec succès</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add to calendar -->
    <div style="text-align:center; margin:30px 0;">
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&amp;text=Rendez-vous+${data?.plateformName ?? process.env.APP_NAME}&amp;dates=20250911T103000Z/20250911T113000Z&amp;details=Rendez-vous+pour+${data?.service}+au+magasin+${data?.magasin}" target="_blank" style="display:inline-block; padding:14px 22px; background:#000; color:#fff; text-decoration:none; font-weight:bold; border-radius:4px;">
        Ajouter au calendrier
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#000; color:#fff; padding:25px 15px; font-size:13px; text-align:center; line-height:1.8;">
      Merci d'avoir choisi <b>${data?.plateformName ?? process.env.APP_NAME}</b>.<br>
      Si vous avez reçu ce message par erreur, veuillez nous contacter.<br><br>
      
      <!-- Social Icons -->
      <div style="margin-top:15px;">
        <a href="${data?.facebook}" target="_blank" style="margin:0 8px; text-decoration:none;">
          <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="width:24px; height:24px;">
        </a>
        <a href="${data?.instagram}" target="_blank" style="margin:0 8px; text-decoration:none;">
          <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" style="width:24px; height:24px;">
        </a>
        <a href="${data?.tiktok}" target="_blank" style="margin:0 8px; text-decoration:none;">
          <img src="https://cdn-icons-png.flaticon.com/24/3046/3046120.png" alt="TikTok" style="width:24px; height:24px;">
        </a>
      </div>

      <div style="margin-top:20px; font-size:12px; color:#aaa;">
        © ${new Date().getFullYear()} ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.
      </div>
    </div>
  </div>
</body>
</html>`
}
