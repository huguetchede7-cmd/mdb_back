import { FedaPay, Transaction } from 'fedapay';
import { LogHelpers } from '../helpers/LogHelpers';

interface Order {
    description: string;
    amount: number;
    callback_url: string;
}

interface Client {
    firstname?: string;
    lastname?: string;
    username: string;
    email?: string;
}

interface FedaPaySettings {
    FEDAYPAY_SANDBOX?: string;
    FEDAYPAY_LIVE_PUBLIC_KEY?: string;
    FEDAYPAY_LIVE_SECRET_KEY?: string;
    FEDAYPAY_TEST_PUBLIC_KEY?: string;
    FEDAYPAY_TEST_SECRET_KEY?: string;
}

interface FedaPayKeys {
    public?: string;
    secret?: string;
    env: 'sandbox' | 'live';
}

class FedayPayService {
    static async init(order: Order, client: Client): Promise<{ id: number, url ?: string } | null> {
        try {
            await FedayPayService.setup();

            /* Créer la transaction */
            const transaction = await Transaction.create({
                description: order.description,
                amount: order.amount,
                callback_url: order.callback_url,
                currency: { iso: 'XOF' },
                customer: {
                    firstname: client?.firstname && client.firstname.length > 0 ? client.firstname : client.username,
                    lastname: client?.lastname && client.lastname.length > 0 ? client.lastname : client.username,
                    email: client?.email && client.email.length > 0 ? client.email : process.env.CLIENT_DEFAULT_EMAIL
                }
            });

            const url = await transaction.generateToken() as {url ?: string}
            return { ...url, id: transaction.id };

        } catch (error) {
            LogHelpers.showException(error as Error);
            return null;
        }
    }

    static async setup(): Promise<FedaPayKeys> {
        const fedaPaySetting: FedaPaySettings = {
            FEDAYPAY_SANDBOX: process.env.FEDAYPAY_SANDBOX,
            FEDAYPAY_LIVE_PUBLIC_KEY: process.env.FEDAYPAY_LIVE_PUBLIC_KEY,
            FEDAYPAY_LIVE_SECRET_KEY: process.env.FEDAYPAY_LIVE_SECRET_KEY,
            FEDAYPAY_TEST_PUBLIC_KEY: process.env.FEDAYPAY_TEST_PUBLIC_KEY,
            FEDAYPAY_TEST_SECRET_KEY: process.env.FEDAYPAY_TEST_SECRET_KEY
        };

        const keys: FedaPayKeys = {
            public: fedaPaySetting.FEDAYPAY_SANDBOX === "true" ? fedaPaySetting.FEDAYPAY_TEST_PUBLIC_KEY : fedaPaySetting.FEDAYPAY_LIVE_PUBLIC_KEY,
            secret: fedaPaySetting.FEDAYPAY_SANDBOX === "true" ? fedaPaySetting.FEDAYPAY_TEST_SECRET_KEY : fedaPaySetting.FEDAYPAY_LIVE_SECRET_KEY,
            env: fedaPaySetting.FEDAYPAY_SANDBOX === "true" ? 'sandbox' : 'live'
        };

        if (keys.secret) {
            FedaPay.setApiKey(keys.secret);
            FedaPay.setEnvironment(keys.env);
        }

        return keys;
    }
}

export default FedayPayService;
