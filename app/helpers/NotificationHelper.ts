export const NotificationHelper = {
  type: {
    login: 1,
    logout: 2,
    poste_create: 3,
    poste_verified: 4,
    poste_rejected: 5,
    selling: 6,
    register: 7,
    register_rejected: 8,
    register_validated: 9,
    withdraw_wait: 10,
    withdraw_confirmed: 11,
    withdraw_rejected: 12,
    welcome: 13,
    delete_my_account: 14,
    ordering: 15,
    ordering_deliverer_accept: 16,
    order_delivering_receipt_package: 17,
    order_delivering_to_client: 18,
    order_delivering_reject_after_accepted: 19,
    order_client_review: 20,
    alert_ad_immobilier: 21,
  },
  statut: {
    failed: -1,
    waiting: 0,
    success: 1
  }
}
