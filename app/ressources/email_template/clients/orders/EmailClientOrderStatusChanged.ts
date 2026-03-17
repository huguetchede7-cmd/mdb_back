interface EmailData {
  image?: string;
  plateformName?: string;
  fullname?: string;
  order_reference?: string;
  status_label?: string;
  status_slug?: string;
  tracking_link?: string;
  tiktok?: string;
}

export const EmailClientOrderStatusChanged = (data: EmailData) => {
  const statusMessages: Record<string, { title: string; message: (ref: string) => string; emoji: string }> = {
    pending: {
      title: "Commande en attente",
      message: (ref) =>
        `Nous avons bien reçu votre commande <b>n°${ref}</b> et elle est actuellement en attente de confirmation. Notre équipe la vérifiera sous peu afin d’en assurer le bon traitement et de garantir que tout est conforme à vos attentes.`,
      emoji: "🕓",
    },
    confirmed: {
      title: "Commande confirmée",
      message: (ref) =>
        `Bonne nouvelle ! Votre commande <b>n°${ref}</b> a été confirmée avec succès. Nous préparons déjà la suite afin que vos articles vous parviennent rapidement et en parfait état.`,
      emoji: "✅",
    },
    validated: {
      title: "Commande validée",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> a été validée par notre équipe. Nous procédons désormais à la préparation de vos produits afin de garantir une qualité optimale avant expédition.`,
      emoji: "📦",
    },
    processing: {
      title: "Commande en cours de traitement",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> est actuellement en cours de traitement. Nos spécialistes s’occupent de chaque article avec le plus grand soin, pour garantir une livraison rapide et conforme.`,
      emoji: "⚙️",
    },
    in_delivery: {
      title: "Verres en cours de livraison",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> est en route ! Nos partenaires logistiques s’assurent qu’elle vous parvienne rapidement et en parfait état.`,
      emoji: "🚚",
    },
    delivered_check: {
      title: "Livrés – vérification technique",
      message: (ref) =>
        `Les articles de votre commande <b>n°${ref}</b> ont été livrés et passent actuellement une vérification technique afin de garantir leur qualité et leur conformité.`,
      emoji: "🔍",
    },
    mounted: {
      title: "Lunettes prêtes",
      message: (ref) =>
        `Les verres de votre commande <b>n°${ref}</b> ont été montés avec soin sur votre monture. Votre paire de lunettes est désormais prête et peut être récupérée ou expédiée selon vos instructions.`,
      emoji: "👓",
    },
    store_delivery: {
      title: "Livraison en magasin",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> est arrivée dans notre magasin. Vous pouvez dès à présent venir la récupérer ou contacter notre équipe pour toute information complémentaire.`,
      emoji: "🏪",
    },
    shipped: {
      title: "Commande expédiée",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> a quitté notre entrepôt et est en route vers votre adresse de livraison. Vous serez notifié dès sa réception pour un suivi optimal.`,
      emoji: "✈️",
    },
    delivered: {
      title: "Commande livrée",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> a été livrée avec succès. Nous espérons que vos articles vous apportent entière satisfaction. Merci de votre confiance et à très bientôt.`,
      emoji: "🎁",
    },
    cancelled: {
      title: "Commande annulée",
      message: (ref) =>
        `Votre commande <b>n°${ref}</b> a été annulée. Si cette action n’a pas été effectuée par vous, veuillez contacter notre service client afin de clarifier la situation.`,
      emoji: "❌",
    },
    refunded: {
      title: "Commande remboursée",
      message: (ref) =>
        `Le remboursement de votre commande <b>n°${ref}</b> a été effectué avec succès. Le montant sera crédité sur votre compte ou moyen de paiement dans les prochains jours ouvrables.`,
      emoji: "💰",
    },
    failed: {
      title: "Échec de commande",
      message: (ref) =>
        `Une erreur est survenue lors du traitement de votre commande <b>n°${ref}</b>. Nous vous invitons à réessayer dans quelques instants ou à contacter notre équipe pour assistance.`,
      emoji: "⚠️",
    },
  };

  const current = statusMessages[data.status_slug ?? "pending"];
  const orderRef = data.order_reference ?? "XXXX";
  const logoUrl = `https://oho-stockage.s3.eu-north-1.amazonaws.com/1761465481007-39739a18-1e10-43e3-b324-c3dc67e312b3.jpg`
  const tracking_link = `${process.env.WEBSITE_URL}/espace-client/commandes/${data.order_reference}`

  return `
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${current.title}</title>
<style>
  body { margin:0; padding:0; background-color:#f5f5f7; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial; }
  table { border-collapse:collapse; width:100%; }
  a { text-decoration:none; }
  p { margin:0; }
  .btn { display:inline-block; padding:10px 18px; background:#e2501f; color:#fff; border-radius:6px; font-weight:600; text-decoration:none; }
</style>
</head>
<body>
  <table width="100%" bgcolor="#f5f5f7">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table width="600" style="background:#fff; border-radius:10px; overflow:hidden;">
          
          <!-- HEADER -->
          <tr>
            <td align="center" style="background:#000000; padding:24px;">
              <img
                src="${logoUrl}"
                alt="${data.plateformName ?? process.env.APP_NAME}"
                width="100"
                style="border-radius:6px; margin-bottom:10px;"
              />
              <h1 style="font-size:22px; color:#ffffff; font-weight:700; margin:0; font-family:Arial, Helvetica, sans-serif;">
                ${current.title} 
              </h1>
            </td>
          </tr>

          <!-- SALUTATION & MESSAGE -->
          <tr>
            <td style="padding:16px 24px; font-family:Arial, Helvetica, sans-serif;">
              <p style="color:#111827; font-size:14px; line-height:22px; margin-bottom:12px;">
                Bonjour <b>${data.fullname ?? 'cher client'}</b>,
              </p>
              <p style="color:#111827; font-size:14px; line-height:22px; margin-bottom:12px;">
                ${current.message(orderRef)}
              </p>
              ${tracking_link
                ? `<p style="margin-top:16px;"><a href="${tracking_link}" class="btn" style="color:white">Voir ma commande</a></p>`
                : ""
              }
              <p style="color:#111827; font-size:14px; line-height:22px; margin-top:12px;">
                Si vous avez la moindre question ou besoin d’assistance, n’hésitez pas à contacter notre service client, nous nous ferons un plaisir de vous aider.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px; background:#000; color:#fff; font-size:12px; text-align:center;">
              Merci d’avoir choisi <b>${data.plateformName ?? process.env.APP_NAME}</b> 
              <div style="margin-top:10px; color:#9ca3af; font-size:11px;">
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
  `;
};
