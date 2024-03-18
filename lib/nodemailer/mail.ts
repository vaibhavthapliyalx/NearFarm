/**
 * @fileoverview This file contains the mailer utility functions.
 * This file is used to send emails to users.
 * This uses the SMTP protocol to send emails, and we are using Brevo CMS SMTP server to send emails.
 */
import nodemailer from 'nodemailer';

// Creates a transporter
// This transporter is used to send emails using the SMTP protocol.
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Sends an email
export async function sendEmail(
    to: string,
    subject: string,
    html: string
): Promise<string | null> {
    const info = await transporter.sendMail({
        from: `"NearFarm" <${process.env.SMTP_FROM}>`,
        to: to,
        subject: subject,
        html: html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return info.messageId;
}