import cron from 'node-cron';
import { ReservationService } from '../services/reservationService';
 

const reservationService = new ReservationService();

// Cada minuto limpiar reservas expiradas
cron.schedule('* * * * *', async () => {
  await reservationService.releaseExpiredReservations();
});
