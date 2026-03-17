    import { OrderProductAttributes } from '../../../../../models/OrderProductModel'
    import { OrderDeliveryAttributes } from '../../../../../models/OrderDeliveryModel'

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
      facebook?: string
      instagram?: string
      tiktok?: string
    }

    // Format as FCFA
    const formatMoney = (amount: number) => `${amount.toLocaleString()} FCFA`

// Render a single product item
function renderProductItem(p: OrderProductAttributes) {
  const hasPromo = p.discount && p.discount > 0
  const finalPrice = p.unit_price ?? 0
  const quantity = p.quantity ?? 1
  const totalAmount = p.final_amount ?? 0

      return `
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding: 0px 0px 8px 0px;">
              <table class="pc-width-fill pc-w620-tableCollapsed-0" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                <tbody>
                  <tr>
                    <td align="left" valign="middle" style="padding: 0px 0px 0px 0px; width: 86px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-spacing-0-16-12-0 pc-w620-align-left" align="left" valign="top">
                            <img src="${p.picture ?? 'https://via.placeholder.com/86'}" class="pc-w620-width-102 pc-w620-height-102 pc-w620-width-102-min pc-w620-align-left" width="86" height="auto" alt="${p.name}" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 100%; height: auto; border-radius: 8px 8px 8px 8px; border: 0;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="left" valign="middle" style="padding: 10px 10px 10px 10px; height: auto;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-spacing-0-0-4-0 pc-w620-align-left" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-padding-0-0-0-0 pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left" style="text-decoration: none;">
                                    <div class="pc-w620-font-size-16px pc-w620-line-height-26px" style="font-size:18px;line-height:28px;text-align:left;text-align-last:left;color:#1b110c;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px; font-weight: 600;" class="pc-w620-font-size-16px pc-w620-line-height-26px">${p.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-left" align="left" valign="top" style="padding: 0px 0px 4px 0px; height: auto;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left" style="text-decoration: none;">
                                    <div style="font-size:16px;line-height:24px;text-align:left;text-align-last:left;color:#2a1e19cc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;">
                                    <span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; font-weight: 400;">
                                      ${quantity} x ${formatMoney(finalPrice)}
                                      ${hasPromo ? `<span style="text-decoration: line-through; color: #FF0000; margin-left: 8px;">${formatMoney(p.amount ?? 0)}</span>` : ''}
                                    </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-left" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left" style="text-decoration: none;">
                                    <div style="font-size:18px;line-height:24px;text-align:left;text-align-last:left;color:#039133;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 24px; font-weight: 600;">${formatMoney(totalAmount)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      `
    }

    // Helper: render all product items
    function renderProductsSection(products?: OrderProductAttributes[]) {
      if (!products || !products.length) return ''
      return products.map(renderProductItem).join('')
    }

    // Helper: render the totals section
    function renderTotalsSection(
      totalNormal: number,
      totalDiscount: number,
      deliveryPrice: number,
      totalWithDelivery: number
    ) {
      return `
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding: 0px 0px 8px 0px;">
              <table class="pc-width-fill pc-w620-tableCollapsed-0" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                <tbody>
                  <tr>
                    <td class="pc-w620-width-200" align="left" valign="middle" style="padding: 8px 0px 8px 0px; width: 406px; height: auto;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-spacing-0-0-0-0 pc-w620-align-left" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-padding-0-0-0-0 pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left" style="text-decoration: none;">
                                    <div class="pc-w620-font-size-16px pc-w620-line-height-26px" style="font-size:16px;line-height:28px;text-align:left;text-align-last:left;color:#1b110ccc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 28px; font-weight: 400;" class="pc-w620-font-size-16px pc-w620-line-height-26px">
                                      <b>Sous total</b>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle" style="padding: 0px 0px 0px 0px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-right" align="right" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-right" width="100%" align="right">
                              <tr>
                                <td valign="top" class="pc-w620-align-right" align="right">
                                  <div class="pc-font-alt pc-w620-align-right pc-w620-fontSize-16 pc-w620-lineHeight-26" style="line-height: 28px; letter-spacing: -0.2px; font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 500; color: #19110d; text-align: right; text-align-last: right;">
                                    <div><span>${formatMoney(totalNormal)}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${totalDiscount > 0 ? `
                  <tr>
                    <td class="pc-w620-width-200" align="left" valign="middle" style="padding: 8px 0px 8px 0px; width: 406px; height: auto;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-left" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left" style="text-decoration: none;">
                                    <div style="font-size:16px;line-height:28px;text-align:left;text-align-last:left;color:#1b110ccc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 28px; font-weight: 400;">
                                      <b>Réduction</b>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle" style="padding: 0px 0px 0px 0px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-right" align="right" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-right" width="100%" align="right">
                              <tr>
                                <td valign="top" class="pc-w620-align-right" align="right">
                                  <div class="pc-font-alt pc-w620-align-right pc-w620-fontSize-16 pc-w620-lineHeight-26" style="line-height: 28px; letter-spacing: -0.2px; font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 500; color: #00af48; text-align: right; text-align-last: right;">
                                    <div><span>-${formatMoney(totalDiscount)}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td class="pc-w620-width-200" align="left" valign="middle" style="padding: 8px 0px 8px 0px; border-bottom: 1px solid #e5e5e5; width: 406px; height: auto;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-left" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left" style="text-decoration: none;">
                                    <div class="pc-w620-font-size-16px pc-w620-line-height-26px" style="font-size:16px;line-height:28px;text-align:left;text-align-last:left;color:#1b110ccc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 28px; font-weight: 400;" class="pc-w620-font-size-16px pc-w620-line-height-26px">
                                        <b>Livraison</b>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>  
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle" style="padding: 0px 0px 0px 0px; border-bottom: 1px solid #e5e5e5;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-right" align="right" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-right" width="100%" align="right">
                              <tr>
                                <td valign="top" class="pc-w620-align-right" align="right">
                                  <div class="pc-font-alt pc-w620-align-right" style="text-decoration: none;">
                                    <div class="pc-w620-font-size-16px pc-w620-line-height-26px" style="font-size:16px;line-height:28px;text-align:right;text-align-last:right;color:#ef1212;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                      <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 28px; font-weight: 500;" class="pc-w620-font-size-16px pc-w620-line-height-26px">+${formatMoney(deliveryPrice)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="pc-w620-width-200" align="left" valign="middle" style="padding: 8px 0px 8px 0px; width: 406px; height: auto;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-left" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc pc-w620-align-left" width="100%" align="left">
                              <tr>
                                <td valign="top" class="pc-w620-align-left" align="left">
                                  <div class="pc-font-alt pc-w620-align-left pc-w620-fontSize-20px pc-w620-lineHeight-32" style="line-height: 34px; letter-spacing: -0px; font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 600; color: #1b110c; text-align: left; text-align-last: left;">
                                    <div><span>Total:</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle" style="padding: 0px 0px 0px 0px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="pc-w620-align-right" align="right" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-auto pc-w620-align-right" width="100%" align="right">
                              <tr>
                                <td valign="top" class="pc-w620-align-right" align="right">
                                  <div class="pc-font-alt pc-w620-align-right pc-w620-fontSize-20px pc-w620-lineHeight-32" style="line-height: 34px; letter-spacing: -0px; font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 600; color: #1b110c; text-align: right; text-align-last: right; white-space: nowrap;">
                                    <div>
                                      <span style="white-space: nowrap;">${formatMoney(totalWithDelivery)}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      `
    }

    export const EmailClientOrderConfirmed = (data: EmailData) => {
      const {
        plateformName,
        fullname,
        order_reference,
        date,
        products,
        delivery,
        total_normal: totalNormal = 0,
        total_discount: totalDiscount = 0,
        total_final: totalFinal = 0,
      } = data

      const deliveryPrice = delivery?.price ?? 0
      const totalWithDelivery = totalFinal + deliveryPrice
      const tracking_link = `${process.env.WEBSITE_URL}/espace-client/commandes/${order_reference}`

      const logoUrl = `https://oho-stockage.s3.eu-north-1.amazonaws.com/1761465481007-39739a18-1e10-43e3-b324-c3dc67e312b3.jpg`
      const appName = plateformName ?? process.env.APP_NAME ?? 'notre boutique'

      return `
    <!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <link href="https://fonts.googleapis.com/css?family=Outfit:ital,wght@0,400;0,500;0,600" rel="stylesheet" />
    <title>Confirmation de commande</title>
    <!-- Made with Postcards Email Builder by Designmodo -->
    <style>
    html, body { margin: 0 !important; padding: 0 !important; min-height: 100% !important; width: 100% !important; -webkit-font-smoothing: antialiased; }
            * { -ms-text-size-adjust: 100%; }
            #outlook a { padding: 0; }
            .ReadMsgBody, .ExternalClass { width: 100%; }
            .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font { line-height: 100%; }
            table, td, th { mso-table-lspace: 0 !important; mso-table-rspace: 0 !important; border-collapse: collapse; }
            u + .body table, u + .body td, u + .body th { will-change: transform; }
            body, td, th, p, div, li, a, span { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-line-height-rule: exactly; }
            img { border: 0; outline: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
            .body .pc-project-body { background-color: transparent !important; }
                            

            @media (min-width: 621px) {
                .pc-lg-hide {  display: none; } 
                .pc-lg-bg-img-hide { background-image: none !important; }
            }
    </style>
    <style>
    @media (max-width: 620px) {
    .pc-project-body {min-width: 0px !important;}
    .pc-project-container, .pc-component {width: 100% !important;}
    .pc-sm-hide {display: none !important;}
    .pc-sm-bg-img-hide {background-image: none !important;}
    .pc-w620-padding-0-0-0-0 {padding: 0px 0px 0px 0px !important;}
    table.pc-w620-spacing-0-0-28-0 {margin: 0px 0px 28px 0px !important;}
    td.pc-w620-spacing-0-0-28-0,th.pc-w620-spacing-0-0-28-0{margin: 0 !important;padding: 0px 0px 28px 0px !important;}
    .pc-w620-font-size-14px {font-size: 14px !important;}
    .pc-w620-width-auto {width: auto !important;}
    .pc-w620-height-auto {height: auto !important;}
    .pc-w620-font-size-16px {font-size: 16px !important;}
    .pc-w620-line-height-26px {line-height: 26px !important;}
    
    .pc-w620-width-fill {width: 100% !important;}
    .pc-w620-width-100pc {width: 100% !important;}
    table.pc-w620-spacing-0-0-0-0 {margin: 0px 0px 0px 0px !important;}
    td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin: 0 !important;padding: 0px 0px 0px 0px !important;}
    .pc-w620-padding-20-20-0-20 {padding: 20px 20px 0px 20px !important;}
    .pc-w620-padding-20-20-20-20 {padding: 20px 20px 20px 20px !important;}
    .pc-w620-padding-28-28-28-28 {padding: 28px 28px 28px 28px !important;}
    .pc-w620-font-size-30px {font-size: 30px !important;}
    .pc-w620-line-height-40px {line-height: 40px !important;}
    table.pc-w620-spacing-0-0-18-0 {margin: 0px 0px 18px 0px !important;}
    td.pc-w620-spacing-0-0-18-0,th.pc-w620-spacing-0-0-18-0{margin: 0 !important;padding: 0px 0px 18px 0px !important;}
    .pc-w620-line-height-140pc {line-height: 140% !important;}
    table.pc-w620-spacing-0-16-12-0 {margin: 0px 16px 12px 0px !important;}
    td.pc-w620-spacing-0-16-12-0,th.pc-w620-spacing-0-16-12-0{margin: 0 !important;padding: 0px 16px 12px 0px !important;}
    div.pc-w620-align-left,th.pc-w620-align-left,a.pc-w620-align-left,td.pc-w620-align-left {text-align: left !important;text-align-last: left !important;}
    table.pc-w620-align-left{float: none !important;margin-right: auto !important;margin-left: 0 !important;}
    img.pc-w620-align-left{margin-right: auto !important;margin-left: 0 !important;}
    .pc-w620-width-102 {width: 102px !important;}
    
    img.pc-w620-width-102-min {min-width: 102px !important;}
    .pc-w620-height-102 {height: 102px !important;}
    table.pc-w620-spacing-0-0-4-0 {margin: 0px 0px 4px 0px !important;}
    td.pc-w620-spacing-0-0-4-0,th.pc-w620-spacing-0-0-4-0{margin: 0 !important;padding: 0px 0px 4px 0px !important;}
    .pc-w620-width-200 {width: 200px !important;}
    .pc-w620-fontSize-16 {font-size: 16px !important;}
    .pc-w620-lineHeight-26 {line-height: 26px !important;}
    div.pc-w620-align-right,th.pc-w620-align-right,a.pc-w620-align-right,td.pc-w620-align-right {text-align: right !important;text-align-last: right !important;}
    table.pc-w620-align-right{float: none !important;margin-left: auto !important;margin-right: 0 !important;}
    img.pc-w620-align-right{margin-right: 0 !important;margin-left: auto !important;}
    .pc-w620-fontSize-20px {font-size: 20px !important;}
    .pc-w620-lineHeight-32 {line-height: 32px !important;}
    .pc-w620-padding-16-28-16-28 {padding: 16px 28px 16px 28px !important;}
    .pc-w620-itemsVSpacings-10 {padding-top: 5px !important;padding-bottom: 5px !important;}
    .pc-w620-itemsHSpacings-16 {padding-left: 8px !important;padding-right: 8px !important;}
    .pc-w620-padding-28-28-0-28 {padding: 28px 28px 0px 28px !important;}
    .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
    .pc-g-ib{display: inline-block !important;}
    .pc-g-b{display: block !important;}
    .pc-g-rb{display: block !important;width: auto !important;}
    .pc-g-wf{width: 100% !important;}
    .pc-g-rpt{padding-top: 0 !important;}
    .pc-g-rpr{padding-right: 0 !important;}
    .pc-g-rpb{padding-bottom: 0 !important;}
    .pc-g-rpl{padding-left: 0 !important;}
    
    .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
    .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
    .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
    .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
    }
    @media (max-width: 520px) {
    .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
    }
    </style>
    <!--[if !mso]><!-- -->
    <style>
    @font-face { font-family: 'Outfit'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4QK1O4i0FQ.woff') format('woff'), url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4QK1O4i0Ew.woff2') format('woff2'); } @font-face { font-family: 'Outfit'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e6yO4i0FQ.woff') format('woff'), url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e6yO4i0Ew.woff2') format('woff2'); } @font-face { font-family: 'Outfit'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1O4i0FQ.woff') format('woff'), url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1O4i0Ew.woff2') format('woff2'); }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
        <style type="text/css">
            .pc-font-alt {
                font-family: Arial, Helvetica, sans-serif !important;
            }
        </style>
        <![endif]-->
    <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
    </head>

    <body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; font-weight: normal; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #ffffff;" bgcolor="#ffffff">
    <table class="pc-project-body" style="table-layout: fixed; width: 100%; min-width: 600px; background-color: #ffffff;" bgcolor="#ffffff" border="0" cellspacing="0" cellpadding="0" role="presentation">
      <tr>
      <td align="center" valign="top" style="width:auto;">
        <table class="pc-project-container" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td class="pc-w620-padding-0-0-0-0" style="padding: 20px 0px 20px 0px;" align="left" valign="top">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
            <tr>
            <td valign="top">
              <!-- BEGIN MODULE: Header -->
              <table width="600" border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="pc-component" style="width: 600px; max-width: 600px;">
              <tr>
                <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 17px 0px;" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                  <td valign="top" class="pc-w620-padding-28-28-28-28" style="padding: 24px 40px 40px 40px; height: unset; background-color: #000000;" bgcolor="#000000">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="pc-w620-spacing-0-0-28-0" align="center" valign="top" style="padding: 0px 0px 13px 0px; height: auto;">
                      <a class="pc-font-alt" href="#" target="_blank" style="text-decoration: none; display: inline-block; vertical-align: top;">
                        <img src="${logoUrl}" width="132" height="132" alt="${appName}" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 132px; height: auto; max-width: 100%; border: 0;" />
                      </a>
                      </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 12px 0px; height: auto;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                        <tr>
                        <td valign="top" align="center">
                          <div class="pc-font-alt" style="text-decoration: none;">
                          <div style="font-size:38px;line-height:128%;text-align:center;text-align-last:center;color:#ffffff;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 38px; line-height: 128%; font-weight: 500;">Commande enregistrée</span>
                            </div>
                          </div>
                          </div>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 12px 0px; height: auto;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                        <tr>
                        <td valign="top" align="center">
                          <div class="pc-font-alt" style="text-decoration: none;">
                          <div style="font-size:19px;line-height:156%;text-align:center;text-align-last:center;color:#ffffffcc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 19px; line-height: 156%; font-weight: 400;">Chère ${fullname ?? 'cliente'}, votre commande nous l'avons reçue et une équipe s'occupe de la préparer.</span>
                            </div>
                          </div>
                          </div>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="padding: 0px 0px 16px 0px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                        <td style="width:unset;" valign="top">
                          <table class="pc-width-hug" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tbody>
                            <tr>
                            <td class="pc-g-rpt pc-g-rpb" valign="top" style="padding-top: 0px; padding-bottom: 0px;">
                              <table style="width: 100%;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                  <td align="center" valign="top">
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="min-width: 100%;">
                                    <tr>
                                      <th valign="top" align="center" style="text-align: center; font-weight: normal;">
                                      <!--[if mso]>
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                <tr>
                    <td valign="middle" align="center" style="border-radius: 126px 126px 126px 126px; background-color: #e2501f; text-align:center; color: #ffffff; padding: 12px 24px 12px 24px; mso-padding-left-alt: 0; margin-left:24px;" bgcolor="#e2501f">
                                        <a class="pc-font-alt" style="display: inline-block; text-decoration: none; text-align: center;" href="${tracking_link ?? '#'}" target="_blank"><span class="pc-w620-font-size-14px" style="font-size:16px;line-height:150%;color:#ffffff;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;display:inline-block;vertical-align:top;"><span style="font-family:'Outfit', Arial, Helvetica, sans-serif;display:inline-block;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 150%; font-weight: 600;" class="pc-w620-font-size-14px">Suivre ma commande</span></span></span></a>
                                    </td>
                </tr>
            </table>
            <![endif]-->
                                      <!--[if !mso]><!-- -->
                                      <a style="display: inline-block; box-sizing: border-box; border-radius: 126px 126px 126px 126px; background-color: #e2501f; padding: 12px 24px 12px 24px; vertical-align: top; text-align: center; text-align-last: center; text-decoration: none; -webkit-text-size-adjust: none;" href="${tracking_link ?? '#'}" target="_blank"><span class="pc-w620-font-size-14px" style="font-size:16px;line-height:150%;color:#ffffff;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;display:inline-block;vertical-align:top;"><span style="font-family:'Outfit', Arial, Helvetica, sans-serif;display:inline-block;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 150%; font-weight: 600;" class="pc-w620-font-size-14px">Suivre ma commande</span></span></span></a>
                                      <!--<![endif]-->
                                      </th>
                                    </tr>
                                    </table>
                                  </td>
                                  </tr>
                                </table>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </tbody>
                          </table>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 40px 0px; height: auto;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-auto" width="100%" style="margin-right: auto; margin-left: auto;">
                        <tr>
                        <td valign="top" align="center">
                          <div class="pc-font-alt" style="text-decoration: none;">
                          <div class="pc-w620-font-size-16px pc-w620-line-height-26px" style="font-size:16px;line-height:156%;text-align:center;text-align-last:center;color:#ffffffb3;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 156%; font-weight: 400;" class="pc-w620-font-size-16px pc-w620-line-height-26px">Cliquer sur le bouton ci-dessous pour suivre votre commande</span>
                            </div>
                          </div>
                          </div>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    <table class="pc-width-fill pc-w620-width-fill pc-w620-tableCollapsed-1" border="0" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#ffffff0d" style="border-collapse: separate; border-spacing: 0; width: 100%; background-color:#ffffff0d; border-radius: 8px 8px 8px 8px;">
                    <tbody>
                      <tr>
                      <td class="pc-w620-width-100pc" valign="top" style="width: 176px; height: auto;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td style="padding: 20px 20px 20px 20px;" align="left">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 0px 0px 8px 0px; height: auto;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div style="font-size:20px;line-height:140%;text-align:left;text-align-last:left;color:#a8a49c;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 20px; line-height: 140%; font-weight: 500;">Résumé</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 0px 0px 8px 0px; height: auto;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div style="font-size:16px;line-height:140%;text-align:left;text-align-last:left;color:#ff9065;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 140%; font-weight: 500;">${order_reference ?? 'N/A'}</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 0px 0px 8px 0px; height: auto;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div class="pc-w620-font-size-14px" style="font-size:16px;line-height:140%;text-align:left;text-align-last:left;color:#dddad9;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 140%; font-weight: 500;" class="pc-w620-font-size-14px">${date}</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div style="font-size:14px;line-height:140%;text-align:left;text-align-last:left;color:#ffffff;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 140%; font-weight: 600;">${formatMoney(totalWithDelivery)}</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          </td>
                        </tr>
                        </table>
                      </td>
                      <td class="pc-w620-width-100pc" valign="middle" style="width: 168px; height: auto;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td style="padding: 20px 20px 20px 20px;" align="left">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 0px 0px 12px 0px; height: auto;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div class="pc-w620-font-size-16px" style="font-size:20px;line-height:140%;text-align:left;text-align-last:left;color:#a8a49c;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 20px; line-height: 140%; font-weight: 500;" class="pc-w620-font-size-16px">Livraison</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 0px 0px 7px 0px; height: auto;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div style="font-size:14px;line-height:140%;text-align:left;text-align-last:left;color:#ffffffcc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 140%; font-weight: 400;">${delivery?.destination ?? '-'}</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="100%">
                              <tr>
                                <td valign="top" align="left">
                                <div class="pc-font-alt" style="text-decoration: none;">
                                  <div class="pc-w620-font-size-14px" style="font-size:16px;line-height:140%;text-align:left;text-align-last:left;color:#ffffff;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                  <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 140%; font-weight: 600;" class="pc-w620-font-size-14px">${delivery?.destination ?? '-'}</span>
                                  </div>
                                  </div>
                                </div>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          </td>
                        </tr>
                        </table>
                      </td>
                      </tr>
                    </tbody>
                    </table>
                  </td>
                  </tr>
                </table>
                </td>
              </tr>
              </table>
              <!-- END MODULE: Header -->
            </td>
            </tr>
            <tr>
            <td valign="top">
              <!-- BEGIN MODULE: Detail Item Order -->
              <table width="600" border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="pc-component" style="width: 600px; max-width: 600px;">
              <tr>
                <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                  <td valign="top" class="pc-w620-padding-16-28-16-28" style="padding: 40px 40px 24px 40px; height: unset; background-color: #ffffff;" bgcolor="#ffffff">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="pc-w620-spacing-0-0-0-0" align="center" valign="top" style="padding: 0px 0px 4px 0px; height: auto;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                        <tr>
                        <td valign="top" class="pc-w620-padding-0-0-0-0" align="center">
                          <div class="pc-font-alt" style="text-decoration: none;">
                          <div class="pc-w620-font-size-30px pc-w620-line-height-40px" style="font-size:32px;line-height:128%;text-align:center;text-align-last:center;color:#1b110c;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.6px;font-style:normal;">
                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 32px; line-height: 128%; font-weight: 500;" class="pc-w620-font-size-30px pc-w620-line-height-40px">Détails</span>
                            </div>
                          </div>
                          </div>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="pc-w620-spacing-0-0-18-0" align="center" valign="top" style="padding: 0px 0px 24px 0px; height: auto;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                        <tr>
                        <td valign="top" class="pc-w620-padding-0-0-0-0" align="center">
                          <div class="pc-font-alt" style="text-decoration: none;">
                          <div class="pc-w620-font-size-16px pc-w620-line-height-140pc" style="font-size:16px;line-height:128%;text-align:center;text-align-last:center;color:#2a1e19cc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:0px;font-style:normal;">
                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 128%; font-weight: 400;" class="pc-w620-font-size-16px pc-w620-line-height-140pc">Numéro de commande: <b>#${order_reference ?? 'xxxxx'}</b></span>
                            </div>
                          </div>
                          </div>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    ${renderProductsSection(products)}
                    ${renderTotalsSection(totalNormal, totalDiscount, deliveryPrice, totalWithDelivery)}
                  </td>
                  </tr>
                </table>
                </td>
              </tr>
              </table>
              <!-- END MODULE: Detail Item Order -->
            </td>
            </tr>
            <tr>
            <td valign="top">
              <!-- BEGIN MODULE: Contact US -->
              <table width="600" border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="pc-component" style="width: 600px; max-width: 600px;">
              <tr>
                <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 49px 0px;" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                  <td valign="top" class="pc-w620-padding-28-28-0-28" style="padding: 28px 40px 2px 40px; height: unset; background-color: #ffffff;" bgcolor="#ffffff">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 28px 0px; height: auto;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                        <tr>
                        <td valign="top" align="center">
                          <div class="pc-font-alt" style="text-decoration: none;">
                          <div class="pc-w620-font-size-30px" style="font-size:32px;line-height:128%;text-align:center;text-align-last:center;color:#1a110c;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.6px;font-style:normal;">
                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 32px; line-height: 128%; font-weight: 500;" class="pc-w620-font-size-30px">Pour toutes préoccupations ou questions</span>
                            </div>
                          </div>
                          </div>
                        </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    </table>
                    <table class="pc-w620-width-fill" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td>
                      <table class="pc-width-fill pc-g-b pc-w620-width-fill" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tbody class="pc-g-b">
                        <tr class="pc-g-ib pc-g-wf">
                          <td class="pc-g-rb pc-g-rpt pc-g-wf pc-w620-itemsVSpacings-10" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-bottom: 0px;">
                          <table style="width: 100%;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 12px 12px 12px 12px; height: auto; background-color: #fcedd0; border-radius: 12px 12px 12px 12px;">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td style="width:unset;" valign="top">
                                <table class="pc-width-hug" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tbody>
                                  <tr>
                                    <td class="pc-g-rpt pc-g-rpb" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                    <img src="https://cloudfilesdm.com/postcards/image-17102359013265.png" width="38" height="38" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 38px; height: 38px; border: 0;" />
                                    </td>
                                    <td valign="middle" style="padding-right: 6px; padding-left: 6px;">
                                    </td>
                                    <td class="pc-g-rpt pc-g-rpb" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                      <tr>
                                      <td align="left" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                                        <tr>
                                          <td valign="top" align="left">
                                          <div class="pc-font-alt" style="text-decoration: none;">
                                            <div style="font-size:18px;line-height:133%;text-align:left;text-align-last:left;color:#1b1b1b;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 133%; font-weight: 500;">Adresse email</span>
                                            </div>
                                            </div>
                                          </div>
                                          </td>
                                        </tr>
                                        </table>
                                      </td>
                                      </tr>
                                      <tr>
                                      <td align="left" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                                        <tr>
                                          <td valign="top">
                                            <div class="pc-font-alt" style="line-height: 143%; letter-spacing: -0.2px; font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: normal; color: #2a1e19;">
                                              <div>
                                                <span>${process.env.MAIL_USERNAME}</span>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                        </table>
                                      </td>
                                      </tr>
                                    </table>
                                    </td>
                                  </tr>
                                  </tbody>
                                </table>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          </td>
                          <td class="pc-w620-itemsHSpacings-16" valign="top" style="padding-right: 8px; padding-left: 8px;">
                          </td>
                          <td class="pc-g-rb pc-g-rpb pc-g-wf pc-w620-itemsVSpacings-10" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-bottom: 10px;">
                          <table style="width: 100%; padding-bottom: 20px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                            <td align="left" valign="top" style="padding: 12px 12px 12px 12px; height: auto; background-color: #fcedd0; border-radius: 12px 12px 12px 12px;">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td style="width:unset;" valign="top">
                                <table class="pc-width-hug" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tbody>
                                  <tr>
                                    <td class="pc-g-rpt pc-g-rpb" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                    <img src="https://cloudfilesdm.com/postcards/image-17102359014306.png" width="38" height="38" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 38px; height: 38px; border: 0;" />
                                    </td>
                                    <td valign="middle" style="padding-right: 6px; padding-left: 6px;">
                                    </td>
                                    <td class="pc-g-rpt pc-g-rpb" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                      <tr>
                                      <td align="left" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                                        <tr>
                                          <td valign="top" align="left">
                                          <div class="pc-font-alt" style="text-decoration: none;">
                                            <div style="font-size:18px;line-height:133%;text-align:left;text-align-last:left;color:#1b1b1b;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                                            <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 133%; font-weight: 500;">Appel direct</span>
                                            </div>
                                            </div>
                                          </div>
                                          </td>
                                        </tr>
                                        </table>
                                      </td>
                                      </tr>
                                      <tr>
                                      <td align="left" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                                        <tr>
                                          <td valign="top">
                                          <div class="pc-font-alt" style="line-height: 143%; letter-spacing: -0.2px; font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: normal; color: #2a1e19;">
                                            <div><span>+${process.env.GENERAL_SETTING_PHONE_1}</span>
                                            </div>
                                          </div>
                                          </td>
                                        </tr>
                                        </table>
                                      </td>
                                      </tr>
                                    </table>
                                    </td>
                                  </tr>
                                  </tbody>
                                </table>
                                </td>
                              </tr>
                              </table>
                            </td>
                            </tr>
                          </table>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      </td>
                    </tr>
                    </table>
                  </td>
                  </tr>
                </table>
                </td>
              </tr>
              </table>
              <!-- END MODULE: Contact US -->
            </td>
            </tr>
            <tr>
            <td valign="top" style="padding-top:30px;">
              <!-- BEGIN MODULE: Footer -->
              <table class="pc-component" style="width: 600px; max-width: 600px;" width="600" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
                <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 25px 40px 10px 40px; height: unset; background-color: #1a110c;" bgcolor="#1a110c">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px; height: auto;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                    <tr>
                      <td valign="top" align="center">
                      <div class="pc-font-alt" style="text-decoration: none;">
                        <div style="font-size:14px;line-height:143%;text-align:center;text-align-last:center;color:#ffffffcc;font-family:'Outfit', Arial, Helvetica, sans-serif;letter-spacing:-0.2px;font-style:normal;">
                        <div style="font-family:'Outfit', Arial, Helvetica, sans-serif;"><span style="font-family: 'Outfit', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 143%; font-weight: 400;">
                        Merci d'avoir choisi ${appName}. Nous restons disponibles pour toute question.</span>
                        </div>
                        </div>
                      </div>
                      </td>
                    </tr>
                    </table>
                  </td>
                  </tr>
                </table>
                </td>
              </tr>
              </table>
              <!-- END MODULE: Footer -->
            </td>
            </tr>
          </table>
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
