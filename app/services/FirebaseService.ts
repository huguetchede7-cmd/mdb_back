import * as admin from 'firebase-admin';
import serviceAccount from '../ressources/oho-les-lunettes-cfe74-firebase-adminsdk-fbsvc-911466884d.json';
import { LogHelpers } from '../helpers/LogHelpers';

type NotificationMessage = {
        notification: { title: string; body: string };
        image?: string;
        token: string;
        tokens?: string[];
        data?: { click_action: string; url: string };
}

export class FirebaseService {

    static FCM_TARGET_ERROR_TOKEN = [
        'messaging/invalid-registration-token',
        'messaging/registration-token-not-registered'
    ]

    constructor() {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                databaseURL: 'https://onyx-7b19d-default-rtdb.firebaseio.com/'
            });
        }
    }

    getAdmin() {
        return admin;
    }

    async verifyVerificationCode(verificationId: string) {
        try {
            const adminInstance = this.getAdmin();
            const decodedToken = await adminInstance.auth().verifyIdToken(verificationId);
            return { phoneNumber: decodedToken.phone_number }
        } catch (error) {
            console.error('Error verifying verification code:', error);
            return null;
        }
    }

    async getAuthTokenDetail(token: string) {
        const result = {
            statut: false,
            data: {
                email: null as string | null,
                name: null as string | null,
                picture: null as string | null
            }
        }
        try {
            const adminInstance = this.getAdmin();
            const decodedToken = await adminInstance.auth().verifyIdToken(token);
            const userRecord = await adminInstance.auth().getUser(decodedToken.uid);

            if (!userRecord.email) {
                throw new Error()
            }
            
            result.statut = true
            result.data = {
                email: userRecord.email || null,
                name: userRecord.displayName || null,
                picture: userRecord.photoURL || null
            }
            return result
        } catch (error) {
            LogHelpers.showException(error as Error)
            result.statut = false
            return result
        }
    }

    async sendNotification({ token, payload} : { token: string, payload: { title: string, body: string, image?: string, url?: string, sound?: string; } }) {
        const result : { sent: string[], failed: string[], delete: string[] } = {sent: [], failed: [], delete:  []}
        try {
            const messaging = (this.getAdmin()).messaging()
            const message = await FirebaseService.composeMessage({ tokens: [token], payload}) as NotificationMessage
            await messaging.send(message)
            result.sent.push(token)
            return result
        } catch (error) {
            console.error('Error sending notification:', error)
            return result
        }
    }

    async sendNotifications({ tokens, payload }: { tokens: string[], payload: { title: string, body: string, image?: string, url?: string, sound ?: string } }) {
        const result: { sent: string[], failed: string[], delete: string[] } = { sent: [], failed: [], delete: [] }
        try {
            const messaging = this.getAdmin().messaging();
            const message = { tokens,
                notification: {
                    title: payload.title,
                    body: payload.body,
                    imageUrl: payload.image
                },
                android: {
                    notification: {
                        sound:  "notification_notification",
                        channelId: "mychanneloho"
                    },
                },
                data: {
                    ...(payload.url ? { url: payload.url } : {})
                }
            }
            const response = await messaging.sendEachForMulticast(message)

            response.responses.forEach((res, index) => {
                const token = tokens[index];
                if (res.success) {
                    result.sent.push(token);
                } else {
                    result.failed.push(token);
                    if (res.error?.code === 'messaging/registration-token-not-registered') {
                    result.delete.push(token);
                    }
                }
            })

            return result

        } catch (error) {
            console.error('Error sending notifications:', error);
            return result;
        }
    }

    static async composeMessage({ tokens, payload }: { 
        tokens: string[], 
        payload: { title: string; body: string; image?: string; url?: string, sound ?: string } 
    }): Promise<NotificationMessage> {
        // Initialisation du message
        const message: {
            notification: { title: string; body: string};
            image?: string;
            token: string;
            tokens?: string[];
            android: {notification: {sound: string, channelId: string}};
            data?: { click_action: string; url: string };
        } = {
            notification: {
                title: payload.title ?? '',
                body: payload.body ?? '',
            },
            android: {
                notification: {
                sound: payload.sound ?? "notification_notification",
                channelId: "mychanneloho"
                },
            },
            token: '', // Placeholder for the token
        };

        // Ajout de l'image si présente
        if (payload.image) {
            message.image = payload.image;
        }

        // Ajout des tokens
        if (tokens.length === 1) {
            message.token = tokens[0];
        } else {
            message.tokens = tokens;
        }

        // Ajout de l'URL en tant que donnée additionnelle
        if (payload.url) {
            message.data = {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                url: payload.url
            };
        }

        return message;
    }
}