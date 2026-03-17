import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function initializeMailTransporter() {
    try {
        const mailSetting = {
            MAIL_HOST: process.env.MAIL_HOST,
            MAIL_PORT: process.env.MAIL_PORT,
            MAIL_USERNAME: process.env.MAIL_USERNAME,
            MAIL_PASSWORD: process.env.MAIL_PASSWORD
        }
        // Create the mail transporter
        const MailTransporter = nodemailer.createTransport({
            host: mailSetting.MAIL_HOST,
            port: mailSetting.MAIL_PORT,
            secure: mailSetting.MAIL_PORT === "465",
            auth: {
                user: mailSetting.MAIL_USERNAME,
                pass: mailSetting.MAIL_PASSWORD
            }
        }as SMTPTransport.Options)

        return MailTransporter
    } catch (error) {
        console.error("Error initializing mail transporter:", error);
    }
}