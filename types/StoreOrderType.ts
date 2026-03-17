import { OrderStatus } from "../app/constants/order-status";

export type StoreOrderType = {
    clientCode: string;
    orderRef: string;
    store: string;
    orderMonth: string;
    orderDate: string;
    customerName: string;
    customerContact: string;
    customerBirthDate?: string;
    insurance: boolean;
    insuranceName: string;
    frameBrandRef: string;
    framePrice: number;
    lensType: string;
    lensPrice: number;
    accessoriesPrice?: number;
    ophthalmologist?: string;
    totalNet: number;
    paidAmount: number;
    insurancePart?: number;
    discount?: number;
    balance: number;
    appointmentDate?: string;
    orderStatus: 0 | OrderStatus.pending | OrderStatus.delivered;
    orderStatusLabel: string;
    paymentStatus: 'UNPAID' | 'PAID';
    storeReceivedAt?: string;
    deliveredAt?: string;
    delivery: boolean;
    company: string;
    insuranceNumber: string;
    customerEmail: string;
    maintenanceProducts: string;
    plaqueAccessory: string;
    caseAccessory: string;
    essuieToutAccessory: string;
    cordonAccessory: string;
    lensSolutionAccessory: string;
    capAccessory: string;
    format: {
        accessories: string[];
    }
};