import { Raffle } from "../entities/raffle.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { Prize, PrizeType } from "../entities/prize.entity";
import { AppDataSource } from "../data-source";
import { generateAllTicketNumbers } from "../utils/generateRandomNumber";
import { Payment } from "../entities/payment.entity";
import { Reservation } from "../entities/reservation.entity";
import { Not } from "typeorm";

export class RaffleService {
    private raffleRepo;
    private ticketRepo;
    private dataSource;

    constructor(
        repos?: { raffle?: any; ticket?: any },
        dataSource?: any
    ) {
        this.raffleRepo = repos?.raffle ?? AppDataSource.getRepository(Raffle);
        this.ticketRepo = repos?.ticket ?? AppDataSource.getRepository(Ticket);
        this.dataSource = dataSource ?? AppDataSource;
    }

    async activateRaffle(id: number) {
        const raffleRepo = this.dataSource.getRepository(Raffle);

        const raffle = await raffleRepo.findOne({
            where: { id },
            relations: ["tickets", "prizes"],
        });

        if (!raffle) throw new Error("Rifa no encontrada");
        if (raffle.status === "active") throw new Error("La rifa ya está activa");
        if (!raffle.prizes || raffle.prizes.length === 0)
            throw new Error("No hay premios para activar la rifa");
        if (raffle.status === "ended")
            throw new Error("No se puede activar una rifa que ya terminó");
        if (raffle.end_date && raffle.end_date < new Date())
            throw new Error("La fecha de finalización ya pasó");

        raffle.status = "active";
        await raffleRepo.save(raffle);

        return { message: "Rifa activada correctamente", raffle };
    }

    async deactivateRaffle(id: number) {
        const raffleRepo = this.dataSource.getRepository(Raffle);

        const raffle = await raffleRepo.findOne({
            where: { id },
            relations: ["tickets"],
        });

        if (!raffle) throw new Error("Rifa no encontrada");
        if (raffle.status !== "active")
            throw new Error("La rifa no está activa");

        raffle.status = "pending";
        await raffleRepo.save(raffle);

        return { message: "La rifa se ha desactivado correctamente", raffle };
    }

    async getAllRaffles() {
        return this.raffleRepo.find({ relations: ["prizes"] });
    }

    async createRaffle(data: {
        title: string;
        description: string;
        price: number;
        end_date: string | Date;
        digits: number;
        type: PrizeType;
    }) {
        const raffleRepo = this.raffleRepo;
        let endDate: Date | null = null;

        if (data.end_date instanceof Date) {
            endDate = data.end_date;
        } else if (typeof data.end_date === "string") {
            const parsed = new Date(
                data.end_date.length === 10
                    ? `${data.end_date}T23:59:59`
                    : data.end_date
            );
            if (isNaN(parsed.getTime()))
                throw new Error("La fecha de finalización no es válida");

            endDate = parsed;
        }

        if (!endDate) throw new Error("Debes proporcionar una fecha de finalización");

        const totalNumbers = Math.pow(10, data.digits);

        const raffle = raffleRepo.create({
            title: data.title,
            description: data.description,
            price: data.price,
            status: "pending",
            end_date: endDate,
            digits: data.digits,
            total_numbers: totalNumbers,
        });

        await raffleRepo.save(raffle);

        setImmediate(async () => {
            try {
                await this.generateTicketsAsync(raffle.id, data.digits);
            } catch (err) {
                console.error("Error generando tickets:", err);
            }
        });
        return {
            message: "Rifa creada correctamente",
            raffle,
            totalTickets: totalNumbers,
        };
    }


    async getRaffleById(id: number) {
        return this.raffleRepo.findOne({
            where: { id },
            relations: ["tickets", "prizes"],
        });
    }


    async deleteRaffle(id: number) {
        const raffle = await this.raffleRepo.findOne({
            where: { id },
        });

        if (!raffle) {
            throw new Error("Rifa no encontrada");
        }

        if (raffle.status === "active") {
            throw new Error("No se puede eliminar una rifa activa");
        }


        const ticketsUsedCount = await this.ticketRepo.count({
            where: {
                raffle: { id },
                status: Not(TicketStatus.AVAILABLE),
            },
        });

        if (ticketsUsedCount > 0) {
            throw new Error(
                "No se puede eliminar una rifa con tickets vendidos o reservados"
            );
        }


        raffle.status = "deleting";
        await this.raffleRepo.save(raffle);


        setImmediate(async () => {
            try {
                await this.deleteRaffleAsync(id);
            } catch (err) {
                console.error("Error eliminando rifa:", err);
            }
        });
        return {
            message: "Rifa en proceso de eliminación",
        };
    }


    async updateRaffle(id: number, data: Partial<Raffle>) {
        const raffleRepo = this.raffleRepo;

        const raffle = await raffleRepo.findOne({ where: { id } });
        if (!raffle) throw new Error("Rifa no encontrada");
        if (raffle.status === "active")
            throw new Error("No puedes actualizar una rifa activa");

        const cleaned: Partial<Raffle> = {};

        if (data.title) cleaned.title = data.title;
        if (data.description) cleaned.description = data.description;
        if (data.price) cleaned.price = data.price;

        if (data.end_date) {
            const parsed = new Date(
                typeof data.end_date === "string"
                    ? `${data.end_date}T23:59:59`
                    : data.end_date
            );
            if (isNaN(parsed.getTime()))
                throw new Error("La fecha no es válida");

            cleaned.end_date = parsed;
        }

        await raffleRepo.update(id, cleaned);
        const updated = await raffleRepo.findOne({ where: { id } });

        return { message: "Rifa actualizada correctamente", raffle: updated };
    }


    async regenerateTickets(raffleId: number, newDigits: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const raffle = await queryRunner.manager.findOne(Raffle, {
                where: { id: raffleId },
            });

            if (!raffle) throw new Error("Rifa no encontrada");
            if (raffle.status === "active")
                throw new Error("No puedes cambiar tickets con rifa activa");

            const existingTickets = await queryRunner.manager.find(Ticket, {
                where: { raffle: { id: raffleId } },
            });

            if (existingTickets.some((t: Ticket) => t.status !== TicketStatus.AVAILABLE))
                throw new Error("Hay tickets reservados o comprados");

            await queryRunner.manager.delete(Ticket, {
                raffle: { id: raffleId },
            });

            const numbers = generateAllTicketNumbers(newDigits);

            const toInsert = numbers.map((num) =>
                queryRunner.manager.create(Ticket, {
                    ticket_number: num,
                    raffleId,
                    status: TicketStatus.AVAILABLE,
                })
            );

            await queryRunner.manager.save(toInsert);

            raffle.digits = newDigits;
            raffle.total_numbers = numbers.length;

            await queryRunner.manager.save(raffle);

            await queryRunner.commitTransaction();

            return {
                message: "Tickets regenerados correctamente",
                total: numbers.length,
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    private async generateTicketsAsync(raffleId: number, digits: number) {
        const batchSize = 1000;
        const total = Math.pow(10, digits);

        const ticketRepo = this.ticketRepo;

        for (let i = 0; i < total; i += batchSize) {
            const batch: Ticket[] = [];

            for (let j = i; j < Math.min(i + batchSize, total); j++) {
                batch.push(
                    ticketRepo.create({
                        raffleId,
                        ticket_number: j.toString().padStart(digits, "0"),
                        status: TicketStatus.AVAILABLE,
                    })
                );
            }

            await ticketRepo.insert(batch);
        }

        await this.raffleRepo.update(raffleId, { status: "pending" });
    }


    private async deleteRaffleAsync(raffleId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Ticket, {
                raffle: { id: raffleId },
            });

            await queryRunner.manager.delete(Reservation, {
                raffle: { id: raffleId },
            });

            await queryRunner.manager.delete(Payment, {
                raffle: { id: raffleId },
            });



            await queryRunner.manager.delete(Prize, {
                raffle: { id: raffleId },
            });

            await queryRunner.manager.delete(Raffle, raffleId);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error("Error eliminando rifa async:", err);
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

}
