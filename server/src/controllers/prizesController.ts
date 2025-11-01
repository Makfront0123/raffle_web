import { Request, Response } from 'express';
import { PrizesService } from '../services/prizesService';
import { AppDataSource } from '../data-source';
import { Prize } from '../entities/prize.entity';
import { Ticket } from '../entities/ticket.entity';

const prizesService = new PrizesService();
export class PrizesController {
    async getWinners(req: Request, res: Response) {
        try {
            const raffleId = Number(req.params.raffleId);
            const winners = await prizesService.getWinners(raffleId);
            res.status(200).json(winners);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo premios', error });
        }
    }
    async getAllPrizes(req: Request, res: Response) {
        try {
            const prizes = await prizesService.getAllPrizes();
            res.status(200).json(prizes);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo premios', error });
        }
    }

    async createPrize(req: Request, res: Response) {
        try {
            const prize = await prizesService.createPrize(req.body);
            res.status(201).json(prize);
        } catch (error) {
            res.status(500).json({ message: 'Error creando premio', error });
        }
    }

    async getPrizeById(req: Request, res: Response) {
        try {
            const prize = await prizesService.getPrizeById(Number(req.params.id));
            if (!prize) return res.status(404).json({ message: 'No se encontró el premio' });
            res.status(200).json(prize);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo premio', error });
        }
    }

    async deletePrize(req: Request, res: Response) {
        try {
            await prizesService.deletePrize(Number(req.params.id));
            res.status(200).json({ message: 'Premio eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error eliminando premio', error });
        }
    }

    async updatePrize(req: Request, res: Response) {
        try {
            const prize = await prizesService.updatePrize(Number(req.params.id), req.body);
            res.status(200).json(prize);
        } catch (error) {
            res.status(500).json({ message: 'Error actualizando premio', error });
        }
    }

    async selectWinner(req: Request, res: Response) {
        try {
            const prizeId = Number(req.params.id);
            const result = await prizesService.selectWinner(prizeId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Error seleccionando ganador', error: error.message || error });
        }
    }

    async closeRaffle(req: Request, res: Response) {
        try {
            const raffleId = Number(req.params.raffleId);
            if (!raffleId) return res.status(400).json({ message: 'Raffle ID requerido' });

            const ticketRepo = AppDataSource.getRepository(Ticket);
            const prizeRepo = AppDataSource.getRepository(Prize);

            // 1️⃣ Marcar todos los tickets como comprados (simulación)
            await ticketRepo.update(
                { raffle: { id: raffleId } },
                { status: 'purchased' }
            );

            // 2️⃣ Obtener todos los premios de la rifa
            const prizes = await prizeRepo.find({
                where: { raffle: { id: raffleId } },
                relations: ['raffle', 'raffle.tickets', 'raffle.tickets.user']
            });

            const results = [];

            // 3️⃣ Seleccionar ganador para cada premio
            for (const prize of prizes) {
                const result = await prizesService.selectWinner(prize.id);
                results.push(result);
            }

            return res.status(200).json({
                message: 'Rifa cerrada y ganadores seleccionados',
                winners: results
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error cerrando rifa', error });
        }
    }


}