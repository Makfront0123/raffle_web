import { AppDataSource } from "../data-source";
import { LessThanOrEqual } from "typeorm";
import { Reservation } from "../entities/reservation.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { Raffle } from "../entities/raffle.entity";
import { Prize } from "../entities/prize.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";

import { PrizesService } from "../services/prizesService";
import { sendEmail } from "../utils/sendEmail";

const prizeService = new PrizesService();

export async function cleanupExpiredReservations() {
    const reservationRepo = AppDataSource.getRepository(Reservation);
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const now = new Date();
    await ticketRepo
        .createQueryBuilder()
        .update(Ticket)
        .set({ status: TicketStatus.AVAILABLE, purchased_at: null })
        .where(`
            id_ticket IN (
                SELECT rt.ticketIdTicket
                FROM reservation_tickets rt
                INNER JOIN reservations r ON r.id = rt.reservationId
                WHERE r.expires_at <= :now
            )
        `, { now })
        .execute();

    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from("reservation_tickets")
        .where(`
            reservationId IN (
                SELECT id FROM reservations WHERE expires_at <= :now
            )
        `, { now })
        .execute();

    const result = await reservationRepo
        .createQueryBuilder()
        .delete()
        .where("expires_at <= :now", { now })
        .execute();

    return result.affected || 0;
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
            const updateResult = await queryRunner.manager
                .createQueryBuilder()
                .update(Raffle)
                .set({ status: "ended" })
                .where("id = :id AND status = :status", {
                    id: raffle.id,
                    status: "active",
                })
                .execute();

            if (updateResult.affected === 0) {
                await queryRunner.rollbackTransaction();
                continue;
            }

            const prizes = await queryRunner.manager.find(Prize, {
                where: { raffle: { id: raffle.id } },
            });

            let winnersAssigned = 0;

            for (const prize of prizes) {

                const winner = await prizeServiceInjected.selectWinner(prize.id);
                if (!winner?.winnerTicket?.user?.email) continue;

                if (winner) {
                    winnersAssigned++;
                    try {
                        await sendEmail({
                            to: winner.winnerTicket.user.email,
                            subject: "🎉 ¡Ganaste una rifa!",
                            text: "",
                            html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
      <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
        
        <h2 style="color: #16a34a;">🎉 ¡Felicidades ${winner.winnerTicket.user.name}!</h2>

        <p>Has ganado en la rifa:</p>
        <h3 style="color: #000;">${raffle.title || "Rifa sin título"}</h3>

        <p><strong>🏆 Premio:</strong> ${winner.prizeName || "Sin premio"}</p>
        <p><strong>🎫 Ticket ganador:</strong> #${winner.winnerTicket.ticket_number || "Sin número"}</p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 14px; color: #555;">
          Nos pondremos en contacto contigo pronto para la entrega del premio.
        </p>

        <p style="margin-top: 20px;">🍀 Gracias por participar</p>

      </div>
    </div>
  `,
                        });
                    } catch (emailError) {
                        console.error(
                            `Error enviando email al ganador (ticket ${winner.winnerTicket.ticket_number}):`,
                            emailError
                        );
                    }
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
