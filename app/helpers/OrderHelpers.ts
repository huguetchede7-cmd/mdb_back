import { OrderStatus } from "../constants/order-status";

export default class OrderHelpers {
    static getStatutIndex(status: OrderStatus) {

        switch (status) {
            case OrderStatus.processing:
                return 1;
            case OrderStatus.in_delivery:
                return 2;
            case OrderStatus.delivered_check:
                return 3;
            case OrderStatus.mounted:
                return 4;
            case OrderStatus.store_delivery:
                return 5;
            default:
                return 0;
        }
    }
}
