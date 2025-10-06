import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/ticket.entity";
import { LessThan } from "typeorm";

export class TicketService {
    private ticketRepo = AppDataSource.getRepository(Ticket);

    /**
     * Cambia el status de un ticket, validando las transiciones permitidas
     * @param ticketId - ID del ticket
     * @param newStatus - Nuevo status deseado ('reserved' | 'purchased')
     */
    async updateTicketStatus(ticketId: number, newStatus: 'reserved' | 'purchased') {
        const ticket = await this.ticketRepo.findOne({ where: { id_ticket: ticketId } });
        if (!ticket) throw new Error(`Ticket #${ticketId} no encontrado.`);

        // Validar transición de status
        if (newStatus === 'reserved' && ticket.status !== 'available') {
            throw new Error(`Ticket #${ticketId} no está disponible para reservar.`);
        }
        if (newStatus === 'purchased' && ticket.status !== 'reserved') {
            throw new Error(`Ticket #${ticketId} no está reservado para poder comprarlo.`);
        }

        ticket.status = newStatus;
        await this.ticketRepo.save(ticket);
        return ticket;
    }

    /**
     * Obtener tickets disponibles para una rifa
     */
    async getAvailableTickets(raffleId: number) {
        return this.ticketRepo.createQueryBuilder('ticket')
            .leftJoin('ticket.raffle', 'raffle')
            .where('ticket.status = :status', { status: 'available' })
            .andWhere('raffle.id = :raffleId', { raffleId })
            .getMany();
    }


    /**
     * Liberar tickets expirados (opcional si quieres integrarlo con el cron)
     */
    async releaseTickets(ticketIds: number[]) {
        const tickets = await this.ticketRepo.findByIds(ticketIds);
        for (const ticket of tickets) {
            if (ticket.status === 'reserved') {
                ticket.status = 'available';
                await this.ticketRepo.save(ticket);
            }
        }
        return tickets;
    }
}
