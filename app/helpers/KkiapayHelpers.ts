import { kkiapay } from '@kkiapay-org/nodejs-sdk';
import { LogHelpers } from './LogHelpers';
import apiHelpers from './apiHelpers';
import { ApiDefaultResponseType } from '../../types/ApiDefaultResponseType';
import { KkiapayTransactionType } from '../../types/KkiapayTransactionType';

class KkiapayHelpers {
    private static instance: KkiapayHelpers;
    private kkiapayClient: ReturnType<typeof kkiapay>;
    private publicKey: string;
    private isSandbox: boolean;

    private constructor() {
        const isDev = process.env.KKIAPAY_SANDBOX == "true";
        this.publicKey = isDev ? `${process.env.KKIAPAY_TEST_PUBLIC_KEY}` : `${process.env.KKIAPAY_PUBLIC_KEY}`;
        this.isSandbox = isDev;

        this.kkiapayClient = kkiapay({
            publickey:  this.publicKey,
            privatekey: isDev ? `${process.env.KKIAPAY_TEST_PRIVATE_KEY}` : `${process.env.KKIAPAY_PRIVATE_KEY}`,
            secretkey: isDev ? `${process.env.KKIAPAY_TEST_SECRET_KEY}` : `${process.env.KKIAPAY_SECRET_KEY}`,
            sandbox: this.isSandbox
        });
    }

    public static getInstance(): KkiapayHelpers {
        if (!KkiapayHelpers.instance) {
            KkiapayHelpers.instance = new KkiapayHelpers();
        }
        return KkiapayHelpers.instance;
    }

    public getPublicKey(): string {
        return this.publicKey;
    }

    public getSandbox(): boolean {
        return this.isSandbox;
    }

    public async getTransactionDetails(transactionId: string): Promise<KkiapayTransactionType
     | null> {
        try {
            const response = await this.kkiapayClient.verify(transactionId);
            return response as KkiapayTransactionType;
        } catch (error) {
            LogHelpers.showException(error as Error);
            return null;
        }
    }

    public async refundTransaction(transactionId: string): Promise<ApiDefaultResponseType> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };
        try {
            const response = await this.kkiapayClient.refund(transactionId);
            
            responseJson.statut = true;
            responseJson.message = 'Transaction remboursée avec succès';
            responseJson.data = response;
            
            return responseJson;
        } catch (error) {
            LogHelpers.showException(error as Error);
            responseJson.message = 'Erreur lors du remboursement';
            return responseJson;
        }
    }
}

export default KkiapayHelpers;
