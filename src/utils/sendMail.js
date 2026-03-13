import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT'),
        auth: {
            user: env('SMTP_USER'),
            pass: env('SMTP_PASSWORD'),
        },
    });

    try {
        await transporter.verify();
        console.log('SMTP connection is valid');
    } catch (error) {
        console.error('SMTP connection is invalid:', error);
        throw new Error('Failed to connect to SMTP server');
    }

    return await transporter.sendMail(options);
};

export default sendMail;