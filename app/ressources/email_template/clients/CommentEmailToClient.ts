import { formatDateFr } from '../../../helpers/DateHelpers'

interface EmailCommentModerationData {
  image?: string;
  plateformName?: string;
  fullname?: string;
  comment?: string;
  status?: 1 | -1;
  reject_reason?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  date?: string;
}


export const emailCommentApprovedToClient = (data: EmailCommentModerationData) => {
  const isApproved = data.status === 1;

  return `<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>
    ${isApproved ? "Commentaire validé" : "Commentaire rejeté"} - ${data?.plateformName ?? process.env.APP_NAME}
  </title>
</head>

<body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f0f0f0; color:#000;">
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px;">

    <!-- Header -->
    <div style="padding-bottom:20px; text-align:center;">
      <img src="${data?.image}" alt="${data?.plateformName ?? process.env.APP_NAME}" style="max-width:120px; margin-bottom:10px;">
      <div style="font-size:22px; font-weight:bold; margin:10px 0;">
        ${
    isApproved
      ? "Votre commentaire a été validé 🎉"
      : "Votre commentaire a été rejeté"
  }
      </div>
    </div>

    <!-- Message -->
    <div style="margin:20px 0; font-size:15px; line-height:1.7;">
      Bonjour ${data?.fullname ?? ""},<br><br>

      ${
    isApproved
      ? `Nous sommes heureux de vous informer que votre commentaire publié le 
             <b>${data?.date ? formatDateFr(data.date) : ""}</b> a été <b>validé</b> et est désormais visible sur notre plateforme.`
      : `Après vérification, votre commentaire publié le 
             <b>${data?.date ? formatDateFr(data.date) : ""}</b> n’a pas pu être validé.`
  }
    </div>

    <!-- Comment -->
    <div style="margin:25px 0; background:#f8f8f8; padding:15px; border-left:4px solid ${
    isApproved ? "#27ae60" : "#e74c3c"
  }; font-size:14px;">
      <b>Votre commentaire :</b><br><br>
      "${data?.comment ?? ""}"
    </div>

    ${
    !isApproved && data?.reject_reason
      ? `<div style="margin:20px 0; font-size:14px; color:#c0392b;">
            <b>Motif du rejet :</b><br>
            ${data.reject_reason}
          </div>`
      : ""
  }

    <!-- Footer message -->
    <div style="margin:20px 0; font-size:14px;">
      ${
    isApproved
      ? "Merci pour votre contribution et votre engagement sur notre plateforme."
      : "Vous pouvez modifier votre commentaire et le soumettre à nouveau si vous le souhaitez."
  }
    </div>

    <!-- Footer -->
    <div style="background:#000; color:#fff; padding:25px 15px; font-size:13px; text-align:center; line-height:1.8;">
      À très bientôt sur <b>${data?.plateformName ?? process.env.APP_NAME}</b>.<br><br>

      <div style="margin-top:15px;">
        <a href="${data?.facebook}" target="_blank" style="margin:0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" width="24">
        </a>
        <a href="${data?.instagram}" target="_blank" style="margin:0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" width="24">
        </a>
        <a href="${data?.tiktok}" target="_blank" style="margin:0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/3046/3046120.png" width="24">
        </a>
      </div>

      <div style="margin-top:20px; font-size:12px; color:#aaa;">
        © ${new Date().getFullYear()} ${data?.plateformName ?? process.env.APP_NAME}. Tous droits réservés.
      </div>
    </div>

  </div>
</body>
</html>`;
};
