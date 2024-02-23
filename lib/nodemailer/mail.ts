import nodemailer from 'nodemailer';

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