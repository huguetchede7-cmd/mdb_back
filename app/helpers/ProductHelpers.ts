import { Op } from "sequelize";
import BrandModel from "../../models/BrandModel";
import ColorModel from "../../models/ColorModel";
import FrameModel from "../../models/FrameModel";
import GlassCategoryModel from "../../models/GlassCategoryModel";
import GlassShapeModel from "../../models/GlassShapeAttributes";
import ProductImageModel from "../../models/ProductImageModel";
import ProductModel from "../../models/ProductModel";
import { GendersHelpers } from "./GenderHelpers";
import { LogHelpers } from "./LogHelpers";
import { OfferHelper } from "./OfferHelper";
import UserModel from "../../models/UserModel";
import AccessoriesCategoryModel from "../../models/AccessoriesCategoryModel";
import SizeGlassModel from "../../models/SizeGlassModel";

class ProductHelpers {

  static SUPER_CATEGORIES = {
    GLASSES: "glasses",
    ACCESSORIES: "accessories"
  }

  static async format({ item, userDetail }: { item: ProductModel, userDetail: UserModel | null }) {
    try {
      const product = item.get()

      // Images
      const images = await ProductImageModel.findAll({
        attributes: ['image_url', 'image_compressed', 'id'],
        where: { product_id: product.id }
      })

      // Category
      const category = product.category_id ? await GlassCategoryModel.findOne({
        attributes: ['name', 'slug', 'picture', 'id'],
        where: { id: product.category_id }
      }) : null

      // Gender
      const gender = product.genre ? GendersHelpers.format(product.genre) : null

      // Shape
      const shape = product.shape_id ? await GlassShapeModel.findOne({
        attributes: ['name', 'picture', 'id'],
        where: { id: product.shape_id }
      }) : null

      // Frame
      const frame = product.frame_id ? await FrameModel.findOne({
        attributes: ['name', 'picture', 'id'],
        where: { id: product.frame_id }
      }) : null

      // brand
      const brand = product.brand_id ? await BrandModel.findOne({
        attributes: ['name', 'picture', 'logo', 'slug', 'id'],
        where: { id: product.brand_id }
      }) : null

      // Size
      let size = "";
      if (Number(product.size)) {
        const sizeData = await SizeGlassModel.findOne({
          attributes: ['name'],
          where: { id: Number(product.size) }
        })

        if (sizeData) {
          size = sizeData.get("name") ?? "";
        }
      }

      // Color
      const color = product.color ? await ColorModel.findOne({
        where: { code: product.color }
      }) : null

      // Accessories Category
      const accessoriesCategory = product.accessories_category ? await AccessoriesCategoryModel.findOne({
        attributes: ['name', 'slug', 'picture', 'id'],
        where: { id: product.accessories_category ?? 0 }
      }) : null

      // twinProducts (product with same specification but different color) (very useful for front-end ui)
      const twinProducts = product.super_categories === ProductHelpers.SUPER_CATEGORIES.GLASSES ? await ProductModel.findAll({
        attributes: ["id", "name", "slug", "color"],
        where: {
          id: { [Op.ne]: product.id },
          is_visible: product.is_visible,
          category_id: product.category_id,
          super_categories: ProductHelpers.SUPER_CATEGORIES.GLASSES,
          size: product.size,
          genre: product.genre,
          shape_id: product.shape_id,
          frame_id: product.frame_id,
          brand_id: product.brand_id
        }
      }) : []

      const twinAccessories = product.super_categories === ProductHelpers.SUPER_CATEGORIES.ACCESSORIES ? await ProductModel.findAll({
        attributes: ["id", "name", "slug", "color"],
        where: {
          id: { [Op.ne]: product.id },
          is_visible: product.is_visible,
          accessories_category: product.accessories_category,
          super_categories: ProductHelpers.SUPER_CATEGORIES.ACCESSORIES
        }
      }) : []

      // offers
      const offers = await OfferHelper.getEligible({ product, userDetail })
      let discountOfferPercent = 0
      let discountOfferAmount = 0
      let discountPromotionalPercent = 0
      let discountPromotionalAmount = 0

      if (offers && offers.length) {
        discountOfferPercent = Number(offers[0].get("discount") ?? 0);
        discountOfferAmount = (discountOfferPercent * product.price) / 100;
        // round to two decimals
        discountOfferAmount = Math.round(discountOfferAmount * 100) / 100;
      }

      if (product.promotional_price) {
        discountPromotionalAmount = product.price - product.promotional_price;
        // Percent discount compared to original price
        discountPromotionalPercent = Math.round((discountPromotionalAmount * 100) / product.price);
      }

      // Figure out the best available discount
      let finalDiscountAmount = 0;
      let finalDiscountPercent = 0;
      let finalType: "offer" | "promotional" | null = null;
      let finalPrice = product.price;

      // We want to suggest the *biggest* discount (lowest price)
      const promotionalFinal = product.promotional_price ? product.promotional_price : product.price;
      const offerFinal = offers && offers.length ? product.price - discountOfferAmount : product.price;

      if (offerFinal < promotionalFinal) {
        finalPrice = offerFinal;
        finalDiscountAmount = discountOfferAmount;
        finalDiscountPercent = discountOfferPercent;
        finalType = "offer";
      } else if (promotionalFinal < product.price) {
        finalPrice = promotionalFinal;
        finalDiscountAmount = discountPromotionalAmount;
        finalDiscountPercent = discountPromotionalPercent;
        finalType = "promotional";
      } else {
        finalPrice = product.price;
        finalType = null;
        finalDiscountAmount = 0;
        finalDiscountPercent = 0;
      }

      const pricing = {
        normal: product.price,
        promotional: product.promotional_price || null,
        offer: offers,
        final: {
          discountPercent: finalDiscountPercent,
          discountAmount: Math.round(finalDiscountAmount * 100) / 100,
          final: Math.round(finalPrice * 100) / 100,
          type: finalType
        }
      }

      return {
        item,
        format: {
          images,
          category,
          gender,
          frame,
          shape,
          color,
          brand,
          size,
          accessories_categories: accessoriesCategory,
          twinProducts,
          twinAccessories,
          pricing
        }
      }
    } catch (error) {
      LogHelpers.showException(error as Error)
    }
  }
}

export { ProductHelpers }
