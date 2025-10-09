import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { TicketController } from '../controllers/ticketController';

const router = express.Router();
const ticketController = new TicketController();

router.get('/:raffleId/sold-percentage', authMiddleware, ticketController.getSoldPercentage);

export default router;
