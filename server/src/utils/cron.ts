import cron from 'node-cron';
import { AppDataSource } from '../data-source';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';
import { Reservation } from '../entities/reservation.entity';
import { ReservationTicket } from '../entities/reservation_ticket.entity';
import { LessThanOrEqual } from 'typeorm';
import { ReservationService } from '../services/reservationService';
import { PrizesService } from '../services/prizesService';
import { Prize } from '../entities/prize.entity';

const reservationsService = new ReservationService();
const prizeService = new PrizesService();
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
      // 1️⃣ Marcar rifa como finalizada
      raffle.status = 'ended';
      await queryRunner.manager.save(raffle);

      // 2️⃣ Obtener los premios asociados a la rifa
      const prizes = await queryRunner.manager.find(Prize, {
        where: { raffle: { id: raffle.id } },
        relations: ['raffle', 'raffle.tickets'], // asegúrate que los tickets están cargados
      });

      // 3️⃣ Asignar ganadores antes de liberar tickets
      for (const prize of prizes) {
        const winner = await prizeService.selectWinner(prize.id);
        console.log(`🏆 Ganador asignado para el premio "${prize.name}":`, winner.winnerTicket.user?.name);
      }

      // 4️⃣ Liberar tickets reservados
      await queryRunner.manager
        .createQueryBuilder()
        .update(Ticket)
        .set({ status: 'available', purchased_at: null })
        .where('raffleId = :raffleId AND status = :status', {
          raffleId: raffle.id,
          status: 'reserved',
        })
        .execute();

      // 5️⃣ Eliminar reservationTickets
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ReservationTicket)
        .where('reservationId IN (SELECT id FROM reservations WHERE raffleId = :raffleId)', {
          raffleId: raffle.id,
        })
        .execute();

      // 6️⃣ Eliminar reservas
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Reservation)
        .where('raffleId = :raffleId', { raffleId: raffle.id })
        .execute();

      await queryRunner.commitTransaction();
      console.log(`🎉 Rifa #${raffle.id} cerrada y ganadores asignados.`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(`❌ Error cerrando rifa #${raffle.id}:`, err);
    } finally {
      await queryRunner.release();
    }
  }


  console.log('✅ Cron finalizado.');
});



/*

*/