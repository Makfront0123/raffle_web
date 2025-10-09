import { Request, Response } from 'express';
import { ReservationService } from '../services/reservationService';

const reservationService = new ReservationService();
export class ReservationController {
  async getAllReservations(req: Request, res: Response) {
    try {
      const reservations = await reservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo reservas', error });
    }
  }

  async createReservation(req: Request, res: Response) {
    try {
      const { raffleId, ticketIds } = req.body;

      if (!req.user || typeof (req.user as any).id !== 'number') {
        return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
      }

      const userId = (req.user as any).id;
      const result = await reservationService.createReservation(userId, raffleId, ticketIds);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creando reserva', error: error.message || error });
    }
  }

  async deleteReservation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.getReservationById(Number(id));
      if (!reservation) return res.status(404).json({ message: 'No se encontró la reserva' });
      await reservationService.deleteReservation(Number(id));
      res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error eliminando reserva', error });
    }
  }


  async getReservationById(req: Request, res: Response) {
    try {
      const reservation = await reservationService.getReservationById(Number(req.params.id));
      if (!reservation) return res.status(404).json({ message: 'No se encontró la reserva' });
      res.status(200).json(reservation);
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo reserva', error });
    }
  }

  async releaseExpiredReservations(req: Request, res: Response) {
    try {
      const result = await reservationService.releaseExpiredReservations();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error liberando reservas expiradas", error });
    }
  }
}
