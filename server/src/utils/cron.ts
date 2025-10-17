import cron from 'node-cron';
import { ReservationService } from '../services/reservationService';
import { AppDataSource } from '../data-source';
import { LessThanOrEqual } from 'typeorm';
import { Raffle } from '../entities/raffle.entity';
import { Ticket } from '../entities/ticket.entity';

const reservationService = new ReservationService();

cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('⏰ Cron job ejecutándose...');

    // 1️⃣ Limpiar reservas expiradas
    await reservationService.releaseExpiredReservations();
    console.log('✅ Reservas expiradas liberadas');

    // 2️⃣ Revisar rifas activas cuyo tiempo se acabó
    const raffleRepo = AppDataSource.getRepository(Raffle);
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const rafflesToCheck = await raffleRepo.find({
      where: { status: 'active', end_date: LessThanOrEqual(new Date()) },
      relations: ['tickets'],
    });

    for (const raffle of rafflesToCheck) {
      const totalTickets = raffle.tickets.length;
      const soldTickets = raffle.tickets.filter(t => t.status === 'purchased').length;
      const soldPercentage = (soldTickets / totalTickets) * 100;

      if (soldPercentage >= 70) {
        // Cerrar rifa
        raffle.status = 'ended';
        await raffleRepo.save(raffle);

        // Liberar tickets reservados
        const reservedTickets = raffle.tickets.filter(t => t.status === 'reserved');
        for (const ticket of reservedTickets) {
          ticket.status = 'available';
          await ticketRepo.save(ticket);
        }

        console.log(`🎉 Rifa #${raffle.id} cerrada (${soldPercentage.toFixed(2)}% vendida). Tickets reservados liberados: ${reservedTickets.length}`);
      } else {
        console.log(`⚠️ Rifa #${raffle.id} NO cerrada (${soldPercentage.toFixed(2)}% vendida)`);
      }
    }
  } catch (error) {
    console.error('❌ Error en cron jobs:', error);
  }
});


/*
import cron from 'node-cron';
import { ReservationService } from '../services/reservationService';
 

 const reservationService = new ReservationService();

 // Cada minuto limpiar reservas expiradas
 cron.schedule('* * * * *', async () => {
   await reservationService.releaseExpiredReservations();
   });
   
*/