import cron from 'node-cron';
import { AppDataSource } from '../data-source';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';
import { LessThanOrEqual } from 'typeorm';

cron.schedule('*/1 * * * *', async () => {
  console.log('⏰ Cron job ejecutándose...');

  const raffleRepo = AppDataSource.getRepository(Raffle);
  const ticketRepo = AppDataSource.getRepository(Ticket);

  const expiredRaffles = await raffleRepo.find({
    where: { status: 'active', end_date: LessThanOrEqual(new Date()) },
    relations: ['tickets'],
  });

  for (const raffle of expiredRaffles) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Marcar rifa como 'ended'
      raffle.status = 'ended';
      await queryRunner.manager.save(raffle);

      // 2️⃣ Liberar tickets reservados que quedaron pendientes
      const reservedTickets = raffle.tickets.filter(t => t.status === 'reserved');

      if (reservedTickets.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Ticket)
          .set({ status: 'available', purchased_at: null })
          .where('raffleId = :raffleId AND status = :status', {
            raffleId: raffle.id,
            status: 'reserved',
          })
          .execute();
      }

      await queryRunner.commitTransaction();

      console.log(`🎉 Rifa #${raffle.id} cerrada. Tickets liberados: ${reservedTickets.length}`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(`❌ Error cerrando rifa #${raffle.id}:`, err);
    } finally {
      await queryRunner.release();
    }
  }

  console.log('✅ Cron job finalizado.');
});
