import { Request, Response } from 'express';
import { RaffleService } from '../services/raffleService';

const raffleService = new RaffleService();

export class RaffleController {
  async getAllRaffles(req: Request, res: Response) {
    try {
      const raffles = await raffleService.getAllRaffles();
      res.status(200).json(raffles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error obteniendo las rifas', error });
    }
  }

  async createRaffle(req: Request, res: Response) {
    try {
      const { title, description, price, endDate, digits, type } = req.body;

      const result = await raffleService.createRaffle({
        title,
        description,
        price,
        end_date: new Date(endDate),
        digits,
        type,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creando la rifa', error });
    }
  }
  async getRaffleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const raffle = await raffleService.getRaffleById(Number(id));
      if (!raffle) return res.status(404).json({ message: 'No se encontró la rifa' });
      res.status(200).json(raffle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error obteniendo la rifa', error });
    }
  }

  async deleteRaffle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const raffle = await raffleService.getRaffleById(Number(id));
      if (!raffle) return res.status(404).json({ message: 'No se encontró la rifa' });

      const result = await raffleService.deleteRaffle(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ message: error.message || 'Error eliminando la rifa' });
    }
  }


  async updateRaffle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, price, endDate } = req.body;

      const raffle = await raffleService.updateRaffle(Number(id), {
        title,
        description,
        price,
        end_date: new Date(endDate),
      });

      res.status(200).json(raffle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error actualizando la rifa', error });
    }
  }

  async regenerateTickets(req: Request, res: Response) {
    try {
      const { raffleId, digits } = req.params;
      const raffle = await raffleService.regenerateTickets(Number(raffleId), Number(digits));
      res.status(200).json(raffle);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ message: error.message || 'Error eliminando la rifa' });
    }
  }

  async activateRaffle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const raffle = await raffleService.activateRaffle(Number(id));
      res.status(200).json(raffle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error activando la rifa', error });
    }
  }
}
