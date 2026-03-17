import { formatDateHelpers } from "../../../../helpers/DateHelpers";

interface EmailData {
    image?: string;
    plateformName?: string;
    fullname ?:string
    service ?:string
    date ?:string
    magasin ?:string
    motif ?:string
    facebook ?:string
    instagram ?:string
    tiktok ?:string
    appointment_num ?:string
}

export const EmailClientAppointmentCanceled = (data: EmailData) => {
    return `<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Annulation de Rendez-vous - ${data?.plateformName ?? process.env.APP_NAME}</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f0f0f0; color:#000;">
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px;">
    <!-- Header -->
    <div style="padding-bottom:20px; text-align:center;">
      <img src="${data?.image}" alt="${data?.plateformName ?? process.env.APP_NAME}" style="max-width:120px; margin-bottom:10px;">
      <div style="font-size:22px; font-weight:bold; margin:10px 0; color:#000000;">Votre rendez-vous a été annulé</div>
    </div>

    <!-- Message -->
    <div style="margin:20px 0; font-size:15px; line-height:1.7;">
      Bonjour,<br><br>
      Nous vous informons que votre rendez-vous prévu pour le <b>${data?.date ? formatDateHelpers(data.date) : ""}</b> au magasin <b>${data?.magasin}</b> a été <b>annulé</b>.<br><br>
      <b>Motif :</b> <span style="color: red">${data?.motif ?? "-"}</span><br><br>
      Nous sommes désolés de ce contretemps et restons disponibles pour fixer une nouvelle date qui vous conviendra.
    </div>

    <!-- Recap -->
    <div style="margin:25px 0;">
      <table style="width:100%; font-size:15px; border-collapse:collapse;">
        <tbody>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="width:35%; padding:10px 0; font-weight:bold;">N° de rendez-vous</th>
            <td style="padding:10px 0;">${data?.appointment_num}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="width:35%; padding:10px 0; font-weight:bold;">Service</th>
            <td style="padding:10px 0;">${data?.service}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Magasin</th>
            <td style="padding:10px 0;">${data?.magasin}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Date initiale</th>
            <td style="padding:10px 0;">${data?.date ? formatDateHelpers(data.date) : ""}</td>
          </tr>
          <tr>
            <th align="left" style="padding:10px 0; font-weight:bold;">Statut</th>
            <td style="padding:10px 0; color:#c0392b;"><b>Annulé</b></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#000; color:#fff; padding:25px 15px; font-size:13px; text-align:center; line-height:1.8;">
      Merci pour votre compréhension.<br>
      Pour toute assistance, n'hésitez pas à nous contacter</b>.<br><br>
      <div style="margin-top:15px;">
        <a href="${data?.facebook}" target="_blank" style="margin:0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" style="width:24px; height:24px;">
        </a>
        <a href="${data?.instagram}" target="_blank" style="margin:0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" style="width:24px; height:24px;">
        </a>
        <a href="${data?.tiktok}" target="_blank" style="margin:0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/3046/3046120.png" style="width:24px; height:24px;">
        </a>
      </div>
      <div style="margin-top:20px; font-size:12px; color:#aaa;">
        © ${new Date().getFullYear()} ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.
      </div>
    </div>
  </div>
</body>
</html>
`
}
