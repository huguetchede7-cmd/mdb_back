export enum OrderStatus {
    pending= 1,
    processing= 4,

    confirmed= 2,
    validated= 3,

    in_delivery= 5,
    delivered_check= 6,
    mounted= 7,
    store_delivery= 8,
    shipped= 9,
    delivered= 10,
    cancelled= 11,
    refunded= 12,
    failed= 13
}