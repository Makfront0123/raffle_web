import { Request, Response } from "express";
import { TicketService } from "../services/ticketService";
export class TicketController {
    private ticketService: any;

    constructor(ticketService = new TicketService()) {
        this.ticketService = ticketService;
    }

    async getSoldPercentage(req: Request, res: Response) {
        try {
            const { raffleId } = req.params;
            const soldPercentage = await this.ticketService.getSoldPercentage(Number(raffleId));
            res.status(200).json(soldPercentage);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo porcentaje vendido', error });
        }
    }

    async getTicketsByUser(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { raffleId } = req.query;

            const tickets = await this.ticketService.getTicketsByUser(
                userId,
                raffleId ? Number(raffleId) : undefined
            );

            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({
                message: "Error obteniendo tickets del usuario",
                error,
            });
        }
    }
}
