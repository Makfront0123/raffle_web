import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { TicketController } from '../controllers/ticketController';
import { validate } from '../middleware/validate';
import { raffleIdSchema } from '../schema/common.schema';

const router = express.Router();
const ticketController = new TicketController();

router.get(
  '/:raffleId/sold-percentage',
  authMiddleware,
  validate({ params: raffleIdSchema }),
  ticketController.getSoldPercentage.bind(ticketController)
);

router.get(
  '/user',
  authMiddleware,
  ticketController.getTicketsByUser.bind(ticketController)
);

export default router;
