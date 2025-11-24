// src/services/raffleService.ts
import { AppDataSource } from '../data-source';
import { PrizeType } from '../entities/prize.entity';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';
import { generateAllTicketNumbers } from '../utils/generateRandomNumber';

export class RaffleService {
    async activateRaffle(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const raffle = await raffleRepo.findOne({ where: { id }, relations: ['tickets', 'prizes'] });
        if (!raffle) throw new Error('Rifa no encontrada');

        if (raffle.status === 'active') {
            throw new Error('La rifa ya está activa');
        }

        if (raffle.prizes.length === 0 || !raffle.prizes) throw new Error('No hay premios para activar la rifa');

        if (raffle.status === 'ended') {
            throw new Error('No se puede activar una rifa que ya terminó');
        }


        if (raffle.prizes.length === 0 || !raffle.prizes) throw new Error('No hay premios para activar la rifa');

        if (raffle.end_date && raffle.end_date < new Date()) {
            throw new Error('La fecha de finalización de la rifa ya ha pasado');
        }

        raffle.status = 'active';
        await raffleRepo.save(raffle);

        return { message: 'La rifa se ha activado correctamente', raffle };
    }

    async deactivateRaffle(id: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const raffle = await raffleRepo.findOne({ where: { id }, relations: ['tickets'] });
        if (!raffle) throw new Error('Rifa no encontrada');
        if (raffle.status !== 'active') {
            throw new Error('La rifa no está activa');
        }
        raffle.status = 'pending';
        await raffleRepo.save(raffle);
        return { message: 'La rifa se ha desactivado correctamente', raffle };
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
        end_date: string | Date;
        digits: number;
        type: PrizeType;
    }) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const ticketRepo = AppDataSource.getRepository(Ticket);
        const total_numbers = Math.pow(10, data.digits);


        let endDate: Date | null = null;

        if (data.end_date) {
            if (data.end_date instanceof Date) {
                endDate = data.end_date;
            } else if (typeof data.end_date === "string") {

                const isOnlyDate = data.end_date.length === 10;

                const dateStr = isOnlyDate
                    ? `${data.end_date}T23:59:59`
                    : data.end_date;

                const parsed = new Date(dateStr);

                if (isNaN(parsed.getTime())) {
                    throw new Error("La fecha de finalización no es válida.");
                }

                endDate = parsed;
            }
        }


        if (!endDate) {
            throw new Error("Debes proporcionar una fecha de finalización.");
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const minAllowedDate = new Date();
        minAllowedDate.setDate(now.getDate() + 7);
        minAllowedDate.setHours(0, 0, 0, 0);

        // Comparamos solo por día
        const endDateCopy = new Date(endDate);
        endDateCopy.setHours(0, 0, 0, 0);

        if (endDateCopy < minAllowedDate) {
            throw new Error("La fecha de finalización debe ser al menos dentro de 7 días.");
        }

        const raffle = raffleRepo.create({
            title: data.title,
            description: data.description,
            price: data.price,
            status: "pending",
            end_date: endDate,
            digits: data.digits,
            total_numbers,
        });

        await raffleRepo.save(raffle);

        const ticketNumbers = generateAllTicketNumbers(data.digits);

        const tickets = ticketNumbers.map((number) =>
            ticketRepo.create({
                ticket_number: number,
                raffle: raffle,
                status: "available",
                purchased_at: null,
            })
        );

        await ticketRepo.save(tickets);

        return {
            message: "Rifa creada correctamente",
            raffle,
            totalTickets: tickets.length,
        };
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

        if (raffle.status === 'active') {
            throw new Error('La rifa no se puede eliminar porque está activa');
        }

        const hasTickets = raffle.tickets && raffle.tickets.length > 0;

        if (raffle.status === 'ended' && hasTickets) {
            throw new Error('Solo se pueden eliminar rifas con estado "ended" si no tienen tickets reservados o comprados');
        }

        const hasActiveTickets = raffle.tickets.some(t => t.status === 'purchased');
        if (hasActiveTickets) {
            throw new Error('No se puede eliminar la reserva: uno o más tickets ya fueron comprados.');
        }

        try {
            await raffleRepo.delete(id);
            return { message: `La rifa #${id} se ha eliminado correctamente` };
        } catch (error: any) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('No se puede eliminar esta rifa porque tiene pagos o registros asociados.');
            }
            throw error;
        }
    }

    async updateRaffle(id: number, data: Partial<Raffle>) {
        const raffleRepo = AppDataSource.getRepository(Raffle);

        const raffle = await raffleRepo.findOne({ where: { id } });
        if (!raffle) throw new Error("Rifa no encontrada");

        if (raffle.status === 'active') {
            throw new Error('La rifa no se puede actualizar porque está activa');
        }


        let endDate: Date | null = raffle.end_date ?? null;


        if (data.end_date !== undefined && data.end_date !== null) {
            let incoming = data.end_date as any;

            if (incoming instanceof Date) {
                endDate = incoming;
            } else if (typeof incoming === "string") {

                const isOnlyDate = incoming.length === 10;
                const dateStr = isOnlyDate ? `${incoming}T23:59:59` : incoming;

                const parsed = new Date(dateStr);
                if (isNaN(parsed.getTime())) {
                    throw new Error("La fecha de finalización no es válida.");
                }

                endDate = parsed;
            } else {
                throw new Error("Formato de fecha no soportado para end_date.");
            }


            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endDateCopy = new Date(endDate);
            endDateCopy.setHours(0, 0, 0, 0);

            if (endDateCopy < today) {
                throw new Error("La fecha de finalización no puede ser anterior a hoy.");
            }
        }

        const filteredData: Partial<Raffle> = {};

        if (typeof data.title === "string" && data.title.trim() !== "") {
            filteredData.title = data.title.trim();
        }

        if (typeof data.description === "string" && data.description.trim() !== "") {
            filteredData.description = data.description.trim();
        }

        if (typeof data.price === "number" && !Number.isNaN(data.price)) {
            filteredData.price = data.price;
        }

        if (typeof data.digits === "number" && !Number.isNaN(data.digits)) {
            filteredData.digits = data.digits;
        }


        if (data.end_date !== undefined && data.end_date !== null) {
            filteredData.end_date = endDate!;
        }

        if (Object.keys(filteredData).length === 0) {
            throw new Error("No se enviaron campos válidos para actualizar");
        }

        await raffleRepo.update(id, filteredData);
        const updated = await raffleRepo.findOne({ where: { id } });

        return {
            message: "Rifa actualizada correctamente",
            raffle: updated,
        };
    }


    async regenerateTickets(raffleId: number, newDigits: number) {
        const raffleRepo = AppDataSource.getRepository(Raffle);
        const ticketRepo = AppDataSource.getRepository(Ticket);

        // Buscar la rifa
        const raffle = await raffleRepo.findOne({ where: { id: raffleId } });
        if (!raffle) throw new Error('Rifa no encontrada');

        if (raffle.status == 'active') {
            throw new Error('No se pueden regenerar los tickets porque la rifa ya está activa');
        }


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

            // Generar nuevos tickets
            const totalTickets = Math.pow(10, newDigits);
            const ticketNumbers = generateAllTicketNumbers(newDigits);

            const chunkSize = 200;
            for (let i = 0; i < ticketNumbers.length; i += chunkSize) {
                const chunk = ticketNumbers.slice(i, i + chunkSize);
                const ticketsChunk = chunk.map(num =>
                    queryRunner.manager.create(Ticket, {
                        ticket_number: num,
                        raffleId: raffle.id,
                        status: 'available',
                        purchased_at: null,
                    })
                );
                await queryRunner.manager.save(ticketsChunk);
            }

            raffle.digits = newDigits;
            raffle.total_numbers = totalTickets;
            await queryRunner.manager.save(raffle);

            await queryRunner.commitTransaction();

            return { message: 'Tickets regenerados correctamente', total: totalTickets };

        } catch (error: any) {
            await queryRunner.rollbackTransaction();

            // 🔹 Captura errores de integridad referencial o SQL
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('No se pueden regenerar los tickets porque existen registros relacionados (pagos o reservas activas).');
            }

            if (error.message?.includes('Duplicate entry')) {
                throw new Error('Error generando tickets: se detectaron números duplicados.');
            }

            throw new Error('Error regenerando los tickets. Intenta nuevamente o contacta al administrador.');
        } finally {
            await queryRunner.release();
        }
    }


}
