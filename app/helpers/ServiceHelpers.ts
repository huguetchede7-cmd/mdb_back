import ServiceModel, { ServiceAttributes } from "../../models/ServiceModel";
import ShopModel, { ShopAttributes } from "../../models/ShopModel";
import ShopServiceModel from "../../models/ShopServiceModel";
import { LogHelpers } from "./LogHelpers";

class ServiceHelpers {

    static CONSULTATION_OPTOMETRY = 9;
    static HYDRAVUE = 10;
    static PRODUCT_ORDER = 11;

    static async format(service: ServiceModel): Promise<{ [K in keyof ServiceAttributes]: ServiceAttributes[K] } & { shops: ShopAttributes[] }> {
        try {
            let shops: ShopModel[] = [];
            const shopServicesLinked = await ShopServiceModel.findAll({
                where: { service_id: service.get('id') }
            });

            if (shopServicesLinked.length) {
                shops = await ShopModel.findAll({
                    where: {
                        id: shopServicesLinked.map(shopService => shopService.get('shop_id'))
                    }
                });
            }

            return {
                ...service.get(),
                shops: shops.map(shop => shop.get())
            };
        } catch (error) {
            LogHelpers.showException(error as Error);
            throw error;
        }
    }
}

export default ServiceHelpers;