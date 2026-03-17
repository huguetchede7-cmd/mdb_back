import * as crypto from 'crypto';
import { LogHelpers } from './LogHelpers';

const cryptoEncrypt = async (text: string): Promise<string | null> => {
    try {
        const key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');
        return `${iv.toString('hex')}.${authTag}.${encrypted}`;
    } catch (error) {
        LogHelpers.showException(error as Error);
        return null;
    }
}

const cryptoDecrypt = async (encryptedData: string): Promise<string | null> => {
    try {
        const [ivHex, authTagHex, encryptedText] = encryptedData.split('.');
        const key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;

    } catch (error) {
        LogHelpers.showException(error as Error);
        return null;
    }
}

export { cryptoEncrypt, cryptoDecrypt };
