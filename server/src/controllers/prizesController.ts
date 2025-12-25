import { Request, Response } from 'express';
import { PrizesService } from '../services/prizesService';

export class PrizesController {
    constructor(private prizesService: PrizesService) { }

    async getWinnersByRaffle(req: Request, res: Response) {
        try {
            const raffleId = Number(req.params.raffleId);
            const winners = await this.prizesService.getWinners(raffleId);
            res.status(200).json(winners);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo ganadores por rifa', error });
        }
    }
    async getWinners(req: Request, res: Response) {
        try {
            const winners = await this.prizesService.getWinners();
            res.status(200).json(winners);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo ganadores', error });
        }
    }


    async getAllPrizes(req: Request, res: Response) {
        try {
            const prizes = await this.prizesService.getAllPrizes();
            res.status(200).json(prizes);
        } catch (error: any) {

            res.status(500).json({ message: 'Error obteniendo premios', error: error.message || error });
        }
    }


    async createPrize(req: Request, res: Response) {
        try {
            const prize = await this.prizesService.createPrize(req.body);
            res.status(201).json(prize);
        } catch (error) {
            res.status(500).json({ message: 'Error creando premio', error });
        }
    }

    async getPrizeById(req: Request, res: Response) {
        try {
            const prize = await this.prizesService.getPrizeById(Number(req.params.id));
            if (!prize) return res.status(404).json({ message: 'No se encontró el premio' });
            res.status(200).json(prize);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo premio', error });
        }
    }

    async deletePrize(req: Request, res: Response) {
        try {
            await this.prizesService.deletePrize(Number(req.params.id));
            res.status(200).json({ message: 'Premio eliminado' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || error });
        }
    }

    async updatePrize(req: Request, res: Response) {
        try {
            const prize = await this.prizesService.updatePrize(
                Number(req.params.id),
                req.body
            );
            res.status(200).json(prize);
        } catch (error) {
            res.status(500).json({ message: 'Error actualizando premio', error });
        }
    }

    async selectWinner(req: Request, res: Response) {
        try {
            const prizeId = Number(req.params.id);
            const winner = await this.prizesService.selectWinner(prizeId);
            res.status(200).json(winner);
        } catch (error: any) {
            res.status(500).json({ message: 'Error seleccionando ganador', error: error.message || error });
        }
    }

    async closeRaffle(req: Request, res: Response) {
        try {
            const raffleId = Number(req.params.raffleId);

            if (!raffleId)
                return res.status(400).json({ message: 'Raffle ID requerido' });

            const result = await this.prizesService.closeRaffle(raffleId);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(500).json({
                message: 'Error cerrando rifa',
                error
            });
        }
    }
}
