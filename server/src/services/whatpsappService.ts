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
    tickets,
    amount,
  }: {
    phone: string;
    raffleName: string;
    tickets: string[]; // ✅ ARRAY REAL
    amount: number;
  }) {
    const cleanPhone = this.normalizePhone(phone);

    const ticketList = tickets.join(", "); // 👈 formato WhatsApp friendly

    const message = `
✨ *Compra Exitosa* ✨

🎟️ Rifa: *${raffleName}*
🎫 Tickets: *${ticketList}*
💰 Valor total: *$${amount} COP*

Gracias por participar 🍀
    `.trim();

    await this.client.messages.create({
      from: "whatsapp:+14155238886", // Twilio Sandbox
      to: `whatsapp:+${cleanPhone}`,
      body: message,
    });
  }
}
