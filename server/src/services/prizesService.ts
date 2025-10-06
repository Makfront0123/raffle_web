
import { AppDataSource } from '../data-source';
import { Prize } from '../entities/prize.entity';
import { Provider } from '../entities/provider.entity';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';

export class PrizesService {
    private prizeRepo = AppDataSource.getRepository(Prize);
    private ticketRepo = AppDataSource.getRepository(Ticket);

    async getAllPrizes() {
        return this.prizeRepo.find({ relations: ['provider'] });
    }

    async getPrizeById(id: number) {
        if (!id) return null;
        return this.prizeRepo.findOne({ where: { id } });
    }

    async createPrize(data: Partial<Prize>) {
        // Vincular proveedor si viene providerId
        if (!data.provider && (data as any).providerId) {
            const providerRepo = AppDataSource.getRepository(Provider);
            const provider = await providerRepo.findOneBy({ id: (data as any).providerId });
            if (!provider) return null;
            data.provider = provider;
        }

        // Vincular rifa si viene raffleId
        if (!data.raffle && (data as any).raffleId) {
            const raffleRepo = AppDataSource.getRepository(Raffle);
            const raffle = await raffleRepo.findOneBy({ id: (data as any).raffleId });
            if (!raffle) return null;
            data.raffle = raffle;
        }

        const prize = this.prizeRepo.create(data);
        return this.prizeRepo.save(prize);
    }


    async updatePrize(id: number, data: Partial<Prize>) {
        const prize = await this.prizeRepo.findOne({ where: { id } });
        if (!prize) throw new Error('Premio no encontrado');

        // Solo actualiza proveedor si viene en la data
        if ((data as any).providerId) {
            const providerRepo = AppDataSource.getRepository(Provider);
            const provider = await providerRepo.findOneBy({ id: (data as any).providerId });
            if (!provider) throw new Error('Proveedor no encontrado');
            prize.provider = provider;
        }

        Object.assign(prize, data);
        return await this.prizeRepo.save(prize);
    }


    async deletePrize(id: number) {
        if (!id) return null;
        await this.prizeRepo.delete(id);
    }

    async selectWinner(prizeId: number) {
        const prize = await this.prizeRepo.findOne({
            where: { id: prizeId },
            relations: ['raffle', 'raffle.tickets', 'raffle.tickets.user'],
        });

        if (!prize) throw new Error('Premio no encontrado');

        // Filtrar tickets comprados
        const purchasedTickets = prize.raffle.tickets.filter(t => t.status === 'purchased');

        if (purchasedTickets.length === 0) {
            throw new Error('No hay tickets comprados para esta rifa');
        }

        // Selección aleatoria
        const winnerTicket = purchasedTickets[Math.floor(Math.random() * purchasedTickets.length)];

        // Guardar ganador
        // Guardar ganador
        prize.winner_ticket = winnerTicket;
        await this.prizeRepo.save(prize);


        return {
            prizeId: prize.id,
            prizeName: prize.name,
            winnerTicket: {
                id_ticket: winnerTicket.id_ticket,
                ticket_number: winnerTicket.ticket_number,
                user: winnerTicket.user ? { id: winnerTicket.user.id, name: winnerTicket.user.name } : null,
            },
        };
    }

}