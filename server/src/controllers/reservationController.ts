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
      const { raffleId, ticketIds } = req.body; // ← asegúrate de enviar userId
      const userId = req.user.id;
      const result = await reservationService.createReservation(userId, raffleId, ticketIds);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creando reserva', error });
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
