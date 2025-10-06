// src/services/raffleService.ts
import { AppDataSource } from '../data-source';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';
import { generateAllTicketNumbers } from '../utils/generateRandomNumber';

export class RaffleService {
    async getAllRaffles() {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const raffles = await raffleRepo.find();
        return raffles;
    }
    async createRaffle(data: {
        title: string;
        description: string;
        price: number;
        end_date: Date;
        digits: number;
    }) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const ticketRepo = AppDataSource.getRepository(Ticket);
        const total_numbers = Math.pow(10, data.digits);



        const raffle = raffleRepo.create({
            title: data.title,
            description: data.description,
            price: data.price,
            status: 'active',
            end_date: data.end_date,
            digits: data.digits,
            total_numbers, // ahora sí existe
        });

        await raffleRepo.save(raffle);

        const ticketNumbers = generateAllTicketNumbers(data.digits);

        const tickets = ticketNumbers.map(number =>
            ticketRepo.create({
                ticket_number: number,
                raffle: raffle,
                status: 'available',
                purchased_at: null,
                user: null,
            })
        );
        await ticketRepo.save(tickets);

        return { raffle, tickets: tickets.length };
    }

    async getRaffleById(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        return await raffleRepo.findOne({
            where: { id },
            relations: ['tickets']
        });
    }

    async deleteRaffle(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        return await raffleRepo.delete(id);
    }

    async updateRaffle(id: number, data: Partial<Raffle>) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        await raffleRepo.update(id, data);
        return await raffleRepo.findOne({ where: { id } });
    }
}
