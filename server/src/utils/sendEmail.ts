import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text, html }: { to: string; subject: string; text: string, html?: string }) => {
    try {
        await resend.emails.send({
            from: "Mariachi Show <reservas@mariachishowdelrecuerdomedellin.com>",
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Resend error:", error);
        throw error;
    }
};