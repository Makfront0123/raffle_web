// src/services/raffleService.ts
import { AppDataSource } from '../data-source';
import { PrizeType } from '../entities/prize.entity';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';
import { generateAllTicketNumbers } from '../utils/generateRandomNumber';

export class RaffleService {
    async activateRaffle(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const raffle = await raffleRepo.findOne({ where: { id }, relations: ['tickets'] });
        if (!raffle) throw new Error('Rifa no encontrada');

        if (raffle.status === 'active') {
            throw new Error('La rifa ya está activa');
        }

        if (raffle.status === 'ended') {
            throw new Error('No se puede activar una rifa que ya terminó');
        }

        raffle.status = 'active';
        await raffleRepo.save(raffle);

        return { message: 'La rifa se ha activado correctamente', raffle };
    }


    async getAllRaffles() {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const raffles = await raffleRepo.find({
            relations: ["prizes"],
        });
        return raffles;
    }

    async createRaffle(data: {
        title: string;
        description: string;
        price: number;
        end_date: Date;
        digits: number;
        type: PrizeType;
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

            })
        );
        await ticketRepo.save(tickets);

        return { raffle, tickets: tickets.length };
    }

    async getRaffleById(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        return await raffleRepo.findOne({
            where: { id },
            relations: ['tickets', 'prizes']
        });
    }

    async deleteRaffle(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const raffle = await raffleRepo.findOne({ where: { id }, relations: ['tickets'] });

        if (!raffle) {
            throw new Error('Rifa no encontrada');
        }

        // 🔹 Solo se puede eliminar si la rifa está terminada
        if (raffle.status !== 'ended') {
            throw new Error('Solo se pueden eliminar rifas con estado "ended"');
        }

        // ✅ Ya no importa si los tickets fueron comprados o reservados
        await raffleRepo.delete(id);

        return { message: `La rifa #${id} se ha eliminado correctamente` };
    }


    async updateRaffle(id: number, data: Partial<Raffle>) {
        const raffleRepo = AppDataSource.getRepository(Raffle);

        // ✅ Filtra campos nulos o undefined
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
        );

        // Si no hay campos válidos, no hacemos nada
        if (Object.keys(filteredData).length === 0) {
            throw new Error('No se enviaron campos válidos para actualizar');
        }

        // ✅ Usa save() en lugar de update() para preservar valores existentes
        const raffle = await raffleRepo.findOne({ where: { id } });
        if (!raffle) throw new Error('Rifa no encontrada');

        Object.assign(raffle, filteredData);
        await raffleRepo.save(raffle);

        return raffle;
    }

    async regenerateTickets(raffleId: number, newDigits: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const ticketRepo = AppDataSource.getRepository(Ticket);

        // Buscar la rifa y sus tickets
        const raffle = await raffleRepo.findOne({ where: { id: raffleId } });
        if (!raffle) throw new Error('Rifa no encontrada');


        // Verificar que no haya tickets reservados o comprados
        const tickets = await ticketRepo.find({ where: { raffle: { id: raffleId } } });
        const hasActiveTickets = tickets.some(t => t.status !== 'available');


        if (hasActiveTickets) {
            throw new Error('No se pueden regenerar los tickets porque hay reservas o compras activas.');
        }

        // Crear queryRunner para manejar transacción
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Eliminar tickets actuales
            await queryRunner.manager.delete(Ticket, { raffle: { id: raffleId } });

            // Generar nuevos tickets con newDigits
            const totalTickets = Math.pow(10, newDigits);
            const ticketNumbers = generateAllTicketNumbers(newDigits);

            // Insertar tickets en bloques de 200
            const chunkSize = 200;
            for (let i = 0; i < ticketNumbers.length; i += chunkSize) {
                const chunk = ticketNumbers.slice(i, i + chunkSize);
                const ticketsChunk = chunk.map(num =>
                    queryRunner.manager.create(Ticket, {
                        ticket_number: num,
                        raffleId: raffle.id, // 🔹 importante
                        status: 'available',
                        purchased_at: null,
                    })
                );

                await queryRunner.manager.save(ticketsChunk);
            }

            raffle.digits = newDigits;
            raffle.total_numbers = Math.pow(10, newDigits);
            await queryRunner.manager.save(raffle);

            await queryRunner.commitTransaction();

            return { message: 'Tickets regenerados correctamente', total: totalTickets };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }


}
