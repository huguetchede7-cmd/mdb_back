import { DeliveryData } from "./DeliveryPriceType";

export type OrderMiscellenaneousType = {
  product_source : string,
  payment_option: string,
  orderDeliveryOptionsData: DeliveryData
};