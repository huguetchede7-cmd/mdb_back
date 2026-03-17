import { formatDateHelpers } from "../../../helpers/DateHelpers";

interface EmailData {
    image?: string;
    plateformName?: string;
    year?: number;
    fullname ?:string
    service ?:string
    date ?:string
    old_date ?:string
    reason ?:string
    magasin ?:string
}

export const EmailAdminAppointmentUpdate = (data: EmailData) => {
    return `<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rendez-vous Modifié - ${data?.plateformName ?? process.env.APP_NAME}</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f0f0f0; color:#000;">
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px;">
    <!-- Header -->
    <div style="padding-bottom:20px; text-align:center;">
      <img src="${data?.image}" alt="${data?.plateformName ?? process.env.APP_NAME}" style="max-width:120px; margin-bottom:10px;">
      <div style="font-size:22px; font-weight:bold; margin:10px 0; color:#000000;">Un rendez-vous a été modifié</div>
    </div>

    <!-- Message -->
    <div style="margin:20px 0; font-size:15px; line-height:1.7;">
      Bonjour,<br><br>
      Le client <b>${data?.fullname}</b> a modifié son rendez-vous.<br><br>
      Voici les informations mises à jour :
    </div>

    <!-- Recap -->
    <div style="margin:25px 0;">
      <table style="width:100%; font-size:15px; border-collapse:collapse;">
        <tbody>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="width:35%; padding:10px 0; font-weight:bold;">Nom du client</th>
            <td style="padding:10px 0;">${data?.fullname}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Service</th>
            <td style="padding:10px 0;">${data?.service}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Magasin</th>
            <td style="padding:10px 0;">${data?.magasin}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Ancienne date</th>
            <td style="padding:10px 0;">${data?.old_date ? formatDateHelpers(data.old_date) : ""}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Nouvelle date</th>
            <td style="padding:10px 0;">${data?.date ? formatDateHelpers(data.date) : ""}</td>
          </tr>
          <tr style="border-bottom:1px solid #ddd;">
            <th align="left" style="padding:10px 0; font-weight:bold;">Raison</th>
            <td style="padding:10px 0;">${data?.reason ?? '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#000; color:#fff; padding:25px 15px; font-size:13px; text-align:center; line-height:1.8;">
      Un rendez-vous existant a été modifié par un client.<br>
      Veuillez mettre à jour votre planning en conséquence.<br><br>
      <div style="margin-top:20px; font-size:12px; color:#aaa;">
        © 2025 ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.
      </div>
    </div>
  </div>
</body>
</html>

`}