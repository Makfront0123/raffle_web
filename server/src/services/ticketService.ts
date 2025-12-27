import { AppDataSource } from "../data-source";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { Payment } from "../entities/payment.entity";

export class TicketService {
    private ticketRepo;
    private paymentRepo;

    constructor(repos?: { ticket?: any; payment?: any }) {
        this.ticketRepo = repos?.ticket ?? AppDataSource.getRepository(Ticket);
        this.paymentRepo = repos?.payment ?? AppDataSource.getRepository(Payment);
    }

    async getSoldPercentage(raffleId: number) {
        const tickets = await this.ticketRepo.find({ where: { raffleId } });

        const total = tickets.length;
        const sold = tickets.filter((t: Ticket) => t.status === TicketStatus.PURCHASED).length;
        const reserved = tickets.filter((t: Ticket) => t.status === TicketStatus.RESERVED).length;
        const available = tickets.filter((t: Ticket) => t.status === TicketStatus.AVAILABLE).length;

        const percentage = total > 0 ? (sold / total) * 100 : 0;

        return {
            raffleId,
            totalTickets: total,
            soldTickets: sold,
            reservedTickets: reserved,
            availableTickets: available,
            soldPercentage: percentage,
        };
    }

    async getTicketsByUser(userId: number, raffleId?: number) {
        const payments = await this.paymentRepo.find({
            where: raffleId
                ? {
                    user: { id: userId },
                    raffle: { id: raffleId },
                }
                : {
                    user: { id: userId },
                },
            relations: ["details", "details.ticket", "raffle", "user"],
            order: { created_at: "DESC" },
        });


        return payments.flatMap((p: any) =>
            p.details.map((d: any) => ({
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
    }
}
