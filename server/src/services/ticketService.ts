import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/ticket.entity";

export class TicketService {
    private ticketRepo = AppDataSource.getRepository(Ticket);

    async getSoldPercentage(raffleId: number) {
        const tickets = await this.ticketRepo.find({ where: { raffleId } });
        const total = tickets.length;
        const sold = tickets.filter(t => t.status === 'purchased').length;
        const reserved = tickets.filter(t => t.status === 'reserved').length;
        const available = tickets.filter(t => t.status === 'available').length;
        const percentage = total > 0 ? (sold / total) * 100 : 0;

        return { raffleId, totalTickets: total, soldTickets: sold, reservedTickets: reserved, availableTickets: available, soldPercentage: percentage };
    }
}
