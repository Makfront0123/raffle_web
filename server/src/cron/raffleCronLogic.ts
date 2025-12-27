import { AppDataSource } from "../data-source";
import { LessThanOrEqual } from "typeorm";
import { Reservation } from "../entities/reservation.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { Raffle } from "../entities/raffle.entity";
import { Prize } from "../entities/prize.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import { ReservationService } from "../services/reservationService";
import { PrizesService } from "../services/prizesService";

const reservationsService = new ReservationService();
const prizeService = new PrizesService();

export async function cleanupExpiredReservations() {
    const reservationRepo = AppDataSource.getRepository(Reservation);
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const expired = await reservationRepo.find({
        where: { expires_at: LessThanOrEqual(new Date()) },
        relations: ["reservationTickets", "reservationTickets.ticket"],
    });

    for (const reservation of expired) {
        const ids = reservation.reservationTickets.map(rt => rt.ticket.id_ticket);

        if (ids.length > 0) {
            await ticketRepo
                .createQueryBuilder()
                .update(Ticket)
                .set({ status: TicketStatus.AVAILABLE, purchased_at: null })
                .whereInIds(ids)
                .execute();
        }

        await reservationRepo.remove(reservation);
    }

    return expired.length;
}


export async function closeExpiredRaffles(prizeServiceInjected = prizeService) {
    const raffleRepo = AppDataSource.getRepository(Raffle);

    const expired = await raffleRepo.find({
        where: { status: "active", end_date: LessThanOrEqual(new Date()) },
        relations: ["tickets"],
    });

    const results: { raffleId: number; winnersAssigned: number }[] = [];

    for (const raffle of expired) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            raffle.status = "ended";
            await queryRunner.manager.save(raffle);

            const prizes = await queryRunner.manager.find(Prize, {
                where: { raffle: { id: raffle.id } },
            });

            let winnersAssigned = 0;

            for (const prize of prizes) {
                const winner = await prizeServiceInjected.selectWinner(prize.id);
                if (winner) {
                    winnersAssigned++;
                }
            }

            await queryRunner.manager
                .createQueryBuilder()
                .update(Ticket)
                .set({ status: TicketStatus.AVAILABLE, purchased_at: null })
                .where("raffleId = :id AND status = :status", {
                    id: raffle.id,
                    status: "reserved",
                })
                .execute();


            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(ReservationTicket)
                .where("reservationId IN (SELECT id FROM reservations WHERE raffleId = :raffleId)", {
                    raffleId: raffle.id,
                })
                .execute();


            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(Reservation)
                .where("raffleId = :raffleId", { raffleId: raffle.id })
                .execute();

            await queryRunner.commitTransaction();

            results.push({ raffleId: raffle.id, winnersAssigned });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    return results;
}
