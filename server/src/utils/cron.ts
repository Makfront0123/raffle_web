import cron from 'node-cron';
import { AppDataSource } from '../data-source';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';
import { Reservation } from '../entities/reservation.entity';
import { ReservationTicket } from '../entities/reservation_ticket.entity';
import { LessThanOrEqual } from 'typeorm';
import { ReservationService } from '../services/reservationService';

const reservationsService = new ReservationService();
cron.schedule('*/1 * * * *', async () => {
  console.log('⏰ Cron ejecutándose...');

  // ✅ 1) Liberar reservas expiradas primero
  try {
    await reservationsService.releaseExpiredReservations();
  } catch (err) {
    console.error("❌ Error liberando reservas expiradas:", err);
  }

  const raffleRepo = AppDataSource.getRepository(Raffle);
  const reservationRepo = AppDataSource.getRepository(Reservation);

  /* ========================================
      1️⃣  LIMPIAR RESERVAS EXPIRADAS
  ========================================= */
  const expiredReservations = await reservationRepo.find({
    where: { expires_at: LessThanOrEqual(new Date()) },
    relations: ['reservationTickets', 'reservationTickets.ticket']
  });


  for (const reservation of expiredReservations) {

    // ✅ Liberar los tickets reservados
    const ticketIds = reservation.reservationTickets.map(rt => rt.ticket.id_ticket);

    if (ticketIds.length > 0) {
      await AppDataSource.getRepository(Ticket)
        .createQueryBuilder()
        .update(Ticket)
        .set({ status: 'available', purchased_at: null })
        .whereInIds(ticketIds)
        .execute();
    }

    // ✅ Eliminar reserva (cascade elimina reservation_tickets)
    await reservationRepo.remove(reservation);
  }

  if (expiredReservations.length > 0) {
    console.log(`🧹 Reservas vencidas eliminadas: ${expiredReservations.length}`);
  }

  /* ========================================
      2️⃣  CERRAR RIFAS QUE YA TERMINARON
  ========================================= */
  const expiredRaffles = await raffleRepo.find({
    where: { status: 'active', end_date: LessThanOrEqual(new Date()) },
    relations: ['tickets'],
  });

  for (const raffle of expiredRaffles) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Marcar rifa como finalizada
      raffle.status = 'ended';
      await queryRunner.manager.save(raffle);

      // Liberar tickets reservados
      await queryRunner.manager
        .createQueryBuilder()
        .update(Ticket)
        .set({ status: 'available', purchased_at: null })
        .where('raffleId = :raffleId AND status = :status', {
          raffleId: raffle.id,
          status: 'reserved'
        })
        .execute();

      // Eliminar reserve tickets asociados a esta rifa
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ReservationTicket)
        .where('reservationId IN (SELECT id FROM reservations WHERE raffleId = :raffleId)', {
          raffleId: raffle.id
        })
        .execute();

      // Eliminar reservas de esta rifa
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Reservation)
        .where('raffleId = :raffleId', { raffleId: raffle.id })
        .execute();

      await queryRunner.commitTransaction();

      console.log(`🎉 Rifa #${raffle.id} cerrada. Tickets liberados y reservas eliminadas.`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(`❌ Error cerrando rifa #${raffle.id}:`, err);
    } finally {
      await queryRunner.release();
    }
  }

  console.log('✅ Cron finalizado.');
});
