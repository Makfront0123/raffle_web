import { AppDataSource } from "../data-source";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { LessThan } from "typeorm";

export const cleanupExpiredPayments = async (): Promise<number> => {
    const now = new Date();

    const paymentRepo = AppDataSource.getRepository(Payment);
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const expiredPayments = await paymentRepo.find({
        where: {
            status: PaymentStatus.PENDING,
            expires_at: LessThan(now),
        },
        relations: ["details", "details.ticket"],
    });

    for (const payment of expiredPayments) {
        payment.status = PaymentStatus.EXPIRED;
        await paymentRepo.save(payment);

        for (const detail of payment.details) {
            const ticket = detail.ticket;

            if (ticket.status === TicketStatus.HELD) {
                ticket.status = TicketStatus.AVAILABLE;
                ticket.held_until = null;

                await ticketRepo.save(ticket);
            }
        }
    }

    return expiredPayments.length;
};