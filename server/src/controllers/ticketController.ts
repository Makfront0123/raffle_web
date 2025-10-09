
import { Request, Response } from 'express';
import { TicketService } from '../services/ticketService';

const ticketService = new TicketService();

export class TicketController {
    async getSoldPercentage(req: Request, res: Response) {
        try {
            const { raffleId } = req.params;
            const soldPercentage = await ticketService.getSoldPercentage(Number(raffleId));
            res.status(200).json(soldPercentage);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo porcentaje vendido', error });
        }
    }
}