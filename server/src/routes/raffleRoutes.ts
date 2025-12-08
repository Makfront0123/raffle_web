import express from 'express';
import {
    RaffleController
} from '../controllers/raffleController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const raffleController = new RaffleController();

router.get('/',  raffleController.getAllRaffles);
router.post('/', authMiddleware, adminMiddleware, raffleController.createRaffle);
router.get('/:id', authMiddleware, raffleController.getRaffleById);
router.delete('/:id', authMiddleware, adminMiddleware, raffleController.deleteRaffle);
router.patch('/:id', authMiddleware, adminMiddleware, raffleController.updateRaffle);
router.put('/:raffleId/regenerate-tickets/:digits', authMiddleware, adminMiddleware, raffleController.regenerateTickets);
router.put('/:id/activate', authMiddleware, adminMiddleware, raffleController.activateRaffle);
router.put('/:id/deactivate', authMiddleware, adminMiddleware, raffleController.deactivateRaffle);


export default router;
