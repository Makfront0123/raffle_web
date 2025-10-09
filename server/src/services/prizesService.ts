
import { AppDataSource } from '../data-source';
import { Payment } from '../entities/payment.entity';
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
        if (!id) throw new Error('ID requerido');
        const prize = await this.prizeRepo.findOne({ where: { id }, relations: ['raffle', 'winnerTicketIdTicket'] });
        if (!prize) throw new Error('Premio no encontrado');
        if (prize.raffle) {
            throw new Error('No se puede eliminar el premio porque tiene una rifa asociada');
        }
        if (prize.winner_ticket) {
            throw new Error('No se puede eliminar el premio porque tiene un ticket ganador asociado');
        }
        await this.prizeRepo.delete(id);
        return { message: `Premio #${id} eliminado correctamente` };
    }

    async selectWinner(prizeId: number) {
        const prize = await this.prizeRepo.findOne({
            where: { id: prizeId },
            relations: ['raffle', 'raffle.tickets'],
        });

        if (!prize) throw new Error('Premio no encontrado');

        const purchasedTickets = prize.raffle.tickets.filter(t => t.status === 'purchased');

        if (purchasedTickets.length === 0) {
            throw new Error('No hay tickets comprados para esta rifa');
        }

        const winnerTicket = purchasedTickets[Math.floor(Math.random() * purchasedTickets.length)];

        // Buscar quién compró ese ticket
        const paymentRepo = AppDataSource.getRepository(Payment);
        const payment = await paymentRepo.findOne({
            where: {
                raffle: { id: prize.raffle.id },
                user: { id: undefined }, // se ajusta abajo
            },
            relations: ['user'],
        });

        prize.winner_ticket = winnerTicket;
        await this.prizeRepo.save(prize);

        return {
            prizeId: prize.id,
            prizeName: prize.name,
            winnerTicket: {
                id_ticket: winnerTicket.id_ticket,
                ticket_number: winnerTicket.ticket_number,
                user: payment?.user ? { id: payment.user.id, name: payment.user.name } : null,
            },
        };
    }

}