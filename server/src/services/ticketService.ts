import { AppDataSource } from "../data-source";
import { Payment } from "../entities/payment.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import { Ticket } from "../entities/ticket.entity";

export class TicketService {
    private ticketRepo = AppDataSource.getRepository(Ticket);
    private paymentRepo = AppDataSource.getRepository(Payment);

    async getSoldPercentage(raffleId: number) {
        const tickets = await this.ticketRepo.find({ where: { raffleId } });
        const total = tickets.length;
        const sold = tickets.filter(t => t.status === 'purchased').length;
        const reserved = tickets.filter(t => t.status === 'reserved').length;
        const available = tickets.filter(t => t.status === 'available').length;
        const percentage = total > 0 ? (sold / total) * 100 : 0;

        return { raffleId, totalTickets: total, soldTickets: sold, reservedTickets: reserved, availableTickets: available, soldPercentage: percentage };
    }

    async getTicketsByUser(userId: number, raffleId?: number) {
        const query = this.paymentRepo
            .createQueryBuilder("payment")
            .leftJoinAndSelect("payment.details", "detail")
            .leftJoinAndSelect("detail.ticket", "ticket")
            .leftJoinAndSelect("payment.raffle", "raffle")
            .where("payment.userId = :userId", { userId });

        if (raffleId) {
            query.andWhere("payment.raffleId = :raffleId", { raffleId });
        }

        const payments = await query
            .orderBy("payment.created_at", "DESC")
            .getMany();

        const tickets = payments.flatMap((p: Payment) =>
            p.details.map((d: PaymentDetail) => ({
                id_ticket: d.ticket.id_ticket,
                ticket_number: d.ticket.ticket_number,
                purchased_at: d.ticket.purchased_at,
                status: d.ticket.status,
                raffle: {
                    id: p.raffle.id,
                    title: p.raffle.title,
                    end_date: p.raffle.end_date,
                },
                payment: {
                    id: p.id,
                    total_amount: p.total_amount,
                    method: p.method,
                    status: p.status,
                    created_at: p.created_at,
                },
            }))
        );

        return tickets;
    }
}
