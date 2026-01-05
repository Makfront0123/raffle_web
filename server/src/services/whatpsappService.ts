import twilio from "twilio";
import { Raffle } from "../entities/raffle.entity";

interface SendReceiptProps {
  phone: string;
  raffle: Raffle;
  tickets: string[];
  amount: number
}

export class WhatsappService {
  private client;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }

  private normalizePhone(phone: string): string {
    let clean = phone.replace(/\D/g, "");
    if (!clean.startsWith("57")) clean = "57" + clean;
    return clean;
  }

  async sendReceipt({ phone, raffle, tickets, amount }: SendReceiptProps) {
    const cleanPhone = this.normalizePhone(phone);
    const ticketList = tickets.join(", ");

    const totalPrize = raffle.prizes?.reduce((sum, prize) => sum + Number(prize.value), 0) || 0;

    let message = `
✨ *Compra Exitosa* ✨

🎟️ Rifa: *${raffle.title}*
🎫 Tickets: *${ticketList}*
💰 Valor total: *$${amount.toLocaleString()} COP*
`;

    if (raffle.prizes && raffle.prizes.length > 0) {
      message += `🏆 Premios:\n`;
      raffle.prizes.forEach((p, i) => {
        message += `${i + 1}. ${p.name} - $${Number(p.value).toLocaleString()} COP\n`;
      });
    }


    if (raffle.end_date) {
      const end = typeof raffle.end_date === "string" ? new Date(raffle.end_date) : raffle.end_date;
      message += `🗓️ Fecha de cierre: *${end.toLocaleDateString()}*\n`;
    }

    message += "\nGracias por participar 🍀";

    await this.client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+${cleanPhone}`,
      body: message.trim(),
    });
  }
}
