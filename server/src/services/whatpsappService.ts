import twilio from "twilio";

export class WhatsappService {
    private client;

    constructor() {
        this.client = twilio(
            process.env.TWILIO_ACCOUNT_SID!,
            process.env.TWILIO_AUTH_TOKEN!
        );
    }

    private normalizePhone(phone: string): string {
        return phone.replace(/\D/g, "");
    }

    async sendReceipt({
        phone,
        raffleName,
        ticketNumber,
        amount,
    }: {
        phone: string;
        raffleName: string;
        ticketNumber: string;
        amount: number;
    }) {
        const cleanPhone = this.normalizePhone(phone);

        const message = `
✨ *Compra Exitosa* ✨

🎟️ Rifa: *${raffleName}*
🎫 Ticket: *${ticketNumber}*
💰 Valor: *$${amount} COP*

Gracias por participar 🍀
    `;

        await this.client.messages.create({
            from: "whatsapp:+14155238886", // Twilio Sandbox
            to: `whatsapp:+${cleanPhone}`, // 👈 FORMATO CORRECTO
            body: message,
        });
    }
}
