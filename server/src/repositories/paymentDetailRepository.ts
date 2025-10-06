import { db } from "../config/db";

export const paymentDetailRepository = {
    async create(paymentDetail: any) {
        const { payment, ticket, amount } = paymentDetail;
        return {
            id: null,
            payment,
            ticket,
            amount,
        } as any;
    },
    async save(detail: any) {
        const { paymentId, ticketIdTicket, amount } = detail;
        await db.query(
            `INSERT INTO payment_details (paymentId, ticketIdTicket, amount) VALUES (?, ?, ?)`,
            [paymentId, ticketIdTicket, amount]
        );
    },
}