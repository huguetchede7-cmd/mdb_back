import { GendersHelpers } from "./GenderHelpers"
import UsersHelpers from "./UsersHelpers"
import OfferModel from "../../models/OfferModel"
import { ProductAttributes } from "../../models/ProductModel"
import UserModel from "../../models/UserModel"
import { LogHelpers } from "./LogHelpers"

export class OfferHelper {
   static format(offer: OfferModel) {
      const offerDetail = offer.get()

        const clientTypes = UsersHelpers.offerTaget(offerDetail.client_types_target)
        const genderTypes = GendersHelpers.format(offerDetail.gender_types_target)

      return {...offerDetail, format : { clientTypes, genderTypes }}
   }

   static async getEligible ({product, userDetail}: {product: ProductAttributes, userDetail: UserModel | null}) {
      try {
         // Fetch user details to get client_type
         const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
         let whereClientTarget = 'AND client_types_target = 3 '
         const replacements : {[key: string]: unknown} = {
            today,
            categorie: product.category_id,
            is_prestige: product.is_prestige,
         }

         if (userDetail) {
            whereClientTarget = ` AND client_types_target IN ('3', '${userDetail.get('client_type')}')`
         }

         const joinTarget = GendersHelpers.formatNumber(product.genre ?? 0).join("','");

         // Build raw SQL query
         const sql = `
            SELECT slug, image, title, code, discount FROM offers
            WHERE (valid_from IS NULL OR valid_from <= :today)
               AND (expired_at IS NULL OR expired_at > :today)
               AND (categorie IS NULL OR categorie = :categorie) 
               ${whereClientTarget}              
               AND gender_types_target IN ('${joinTarget}') 
               AND is_prestige = :is_prestige 
               AND discount IS NOT NULL
            ORDER BY discount DESC
         `;

         const offersList = await OfferModel.sequelize!.query(sql, {
            replacements: replacements,
            model: OfferModel,
            mapToModel: true
         });

         if (!offersList.length) {
            return []
         }

         return offersList;
      } catch (error) {
         LogHelpers.showException(error as Error)
         return []
      }
   }
}
