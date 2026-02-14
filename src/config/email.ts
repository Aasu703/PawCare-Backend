import nodemailer from 'nodemailer';
const EMAIL_PASS = process.env.EMAIL_PASS as string;
const EMAIL_USER = process.env.EMAIL_USER as string;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('EMAIL_USER or EMAIL_PASS not set in environment variables');
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const mailOptions = {
            from: `PawCare <${EMAIL_USER}>`,
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw to let caller handle
    }
}