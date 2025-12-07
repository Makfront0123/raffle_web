import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Payment } from '../entities/payment.entity';
import { PaymentDetail } from '../entities/payment_details.entity';
import { Prize } from '../entities/prize.entity';
import { Provider } from '../entities/provider.entity';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';

export class PrizesService {
    private prizeRepo = AppDataSource.getRepository(Prize);
    private ticketRepo = AppDataSource.getRepository(Ticket);
    private paymentRepo = AppDataSource.getRepository(Payment);
    private paymentDetailRepo = AppDataSource.getRepository(PaymentDetail);

    async getAllPrizes() {
        return this.prizeRepo.find({ relations: ['provider', 'raffle'] });
    }

    async getPrizeById(id: number) {
        if (!id) return null;
        return this.prizeRepo.findOne({ where: { id } });
    }

    async createPrize(
        data: Partial<Prize> & { providerId?: number; raffleId?: number }
    ) {

        if (!data.provider && (data as any).providerId) {
            const providerRepo = AppDataSource.getRepository(Provider);
            const provider = await providerRepo.findOneBy({ id: (data as any).providerId });
            if (!provider) return null;
            data.provider = provider;
        }

        if (!data.raffle && (data as any).raffleId) {
            const raffleRepo = AppDataSource.getRepository(Raffle);
            const raffle = await raffleRepo.findOneBy({ id: (data as any).raffleId });
            if (!raffle) return null;
            data.raffle = raffle;
        }

        const prize = this.prizeRepo.create(data);

        // ⭐ SOLUCIÓN: faltaba el await
        const saved = await this.prizeRepo.save(prize);

        return {
            message: 'Premio creado correctamente',
            data: saved
        };
    } async updatePrize(
        id: number,
        data: Partial<Prize> & { providerId?: number; raffleId?: number }
    ) {

        const prize = await this.prizeRepo.findOne({ where: { id } });
        if (!prize) throw new Error('Premio no encontrado');

        if ((data as any).providerId) {
            const providerRepo = AppDataSource.getRepository(Provider);
            const provider = await providerRepo.findOneBy({ id: (data as any).providerId });
            if (!provider) throw new Error('Proveedor no encontrado');
            prize.provider = provider;
        }

        if (typeof data.name === "string" && data.name.trim() !== "") {
            prize.name = data.name.trim();
        }

        if (data.value !== undefined && data.value !== null && !Number.isNaN(Number(data.value))) {
            prize.value = Number(data.value);
        }


        const saved = await this.prizeRepo.save(prize);
        return {
            message: 'Premio actualizado correctamente',
            data: saved
        }
    }

    async deletePrize(id: number) {
        if (!id) throw new Error('ID requerido');


        const prize = await this.prizeRepo.findOne({
            where: { id },
            relations: ['raffle', 'raffle.tickets', 'winner_ticket'],
        });

        if (!prize) throw new Error('Premio no encontrado');

        if (prize.raffle.status === 'active') {
            throw new Error('No se puede eliminar el premio porque la rifa está activa');
        }

        if (prize.winner_ticket) {
            throw new Error('No se puede eliminar el premio porque tiene un ticket ganador asociado');
        }


        if (prize.raffle && prize.raffle.tickets.length > 0 && prize.raffle.tickets.some(t => t.status === 'purchased')) {
            throw new Error('No se puede eliminar el premio porque tiene tickets comprados asociados');
        }

        if (prize.raffle && prize.raffle.tickets.length > 0 && prize.raffle.tickets.some(t => t.status === 'reserved')) {
            throw new Error('No se puede eliminar el premio porque tiene tickets reservados asociados');
        }

        await this.prizeRepo.delete(id);
        return { message: `Premio #${id} eliminado correctamente` };
    }



    async selectWinner(
        prizeId: number
    ): Promise<{
        prizeId: number;
        prizeName: string;
        winnerTicket: {
            id_ticket: number;
            ticket_number: number;
            user: { id: number; name: string; email: string };
        };
    }> {

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

        const paymentDetail = await this.paymentDetailRepo.findOne({
            where: { ticket: { id_ticket: winnerTicket.id_ticket } },
            relations: ['payment', 'payment.user'],
        });

        if (!paymentDetail?.payment?.user) {
            throw new Error("No se encontró el usuario asociado al ticket ganador");
        }

        prize.winner_ticket = winnerTicket;
        await this.prizeRepo.save(prize);

        return {
            prizeId: prize.id,
            prizeName: prize.name,
            winnerTicket: {
                id_ticket: winnerTicket.id_ticket,
                ticket_number: Number(winnerTicket.ticket_number),
                user: {
                    id: paymentDetail.payment.user.id,
                    name: paymentDetail.payment.user.name,
                    email: paymentDetail.payment.user.email,
                }
            },
        };

    }

    async getWinners(raffleId?: number) {
        const qb = this.prizeRepo
            .createQueryBuilder('prize')
            .leftJoinAndSelect('prize.raffle', 'raffle')
            .leftJoinAndSelect('prize.winner_ticket', 'ticket')
            .leftJoin('payment_details', 'pd', 'pd.ticketId = ticket.id_ticket')
            .leftJoin('payments', 'p', 'p.id = pd.paymentId')
            .leftJoin('users', 'u', 'u.id = p.userId')
            .where('prize.winner_ticket IS NOT NULL');

        if (raffleId) {
            qb.andWhere('raffle.id = :raffleId', { raffleId });
        }

        const raw = await qb.select([
            'prize.id AS prize_id',
            'prize.name AS prize_name',
            'prize.type AS prize_type',
            'prize.value AS prize_value',
            'raffle.id AS raffle_id',
            'raffle.title AS raffle_title',
            'ticket.ticket_number AS winner_ticket',
            'u.id AS user_id',
            'u.name AS user_name',
            'u.email AS user_email'
        ]).getRawMany();


        return raw.map(p => ({
            prize_id: p.prize_id,
            prize_name: p.prize_name,
            prize_type: p.prize_type,
            value: p.prize_value,
            raffle_id: p.raffle_id,          // <-- agregar ID
            raffle_title: p.raffle_title,
            winner_ticket: p.winner_ticket,
            winner_user: p.user_name ? `${p.user_name} (${p.user_email})` : null,
        }));

    }

    async closeRaffle(raffleId: number) {
        if (!raffleId) throw new Error("Raffle ID requerido");

        // Repos
        const prizeRepo = this.prizeRepo;
        const ticketRepo = this.ticketRepo;

        // 1️⃣ Marcar todos los tickets como comprados
        await ticketRepo.update(
            { raffle: { id: raffleId } },
            { status: 'purchased' }
        );

        // 2️⃣ Obtener todos los premios de la rifa
        const prizes = await prizeRepo.find({
            where: { raffle: { id: raffleId } },
            relations: ['raffle', 'raffle.tickets', 'raffle.tickets.user'],
        });

        if (!prizes.length) {
            return {
                message: 'Rifa cerrada pero no hay premios registrados',
                winners: []
            };
        }

        const winners = [];

        // 3️⃣ Seleccionar ganador para cada premio
        for (const prize of prizes) {
            const result = await this.selectWinner(prize.id);
            winners.push(result);
        }

        return {
            message: 'Rifa cerrada y ganadores seleccionados',
            winners
        };
    }

}