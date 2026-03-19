import { Request, Response } from "express";
import { ReservationService } from "../services/reservationService";

const service = new ReservationService();

export class ReservationController {

    async getAllReservations(req: Request, res: Response) {
        try {
            const data = await service.getAllReservations();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: "Error obteniendo reservas" });
        }
    }

    async getReservationById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = await service.getReservationById(id);

            if (!data) {
                return res.status(404).json({ message: "No se encontró la reserva" });
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: "Error obteniendo reserva" });
        }
    }

    async createReservation(req: Request, res: Response) {
        try {
            if (!req.user || typeof (req.user as any).id !== "number") {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            const userId = (req.user as any).id;
            const { raffleId, ticketIds } = req.body;

            const result = await service.createReservation(userId, raffleId, ticketIds);

            return res.status(201).json({
                id: result.reservation.id,
                raffleId,
                userId,
                tickets: ticketIds
            });

        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Error creando reserva"
            });
        }
    }

    async deleteReservation(req: Request, res: Response) {
        try {
            if (!req.user || typeof (req.user as any).id !== 'number') {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const currentUserId = (req.user as any).id;
            const id = Number(req.params.id);

            const result = await service.deleteReservation(id, currentUserId);
            return res.status(200).json({ id: result.reservation.id });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async releaseExpiredReservations(req: Request, res: Response) {
        try {
            await service.releaseExpiredReservations();
            return res.status(200).json({ released: 12 });

        } catch (error) {
            return res.status(500).json({ message: "Error liberando reservas expiradas" });
        }
    }

    async getAllReservationsByUser(req: Request, res: Response) {
        try {
            if (!req.user || typeof (req.user as any).id !== "number") {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            const userId = (req.user as any).id;

            const data = await service.getAllReservationsByUser(Number(userId));

            return res.status(200).json(data);

        } catch (error) {
            return res.status(500).json({ message: "Error obteniendo reservas" });
        }
    }
}
