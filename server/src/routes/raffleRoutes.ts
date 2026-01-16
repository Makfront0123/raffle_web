import express from 'express';
import {
    RaffleController
} from '../controllers/raffleController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { auth } from 'google-auth-library';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';

const router = express.Router();
const raffleController = new RaffleController();

router.get('/', raffleController.getAllRaffles);
router.post('/', authMiddleware, adminMiddleware, adminMiddlewareLimited, raffleController.createRaffle);
router.get('/:id', authMiddleware, raffleController.getRaffleById);
router.delete('/:id', authMiddleware, adminMiddleware, adminMiddlewareLimited, raffleController.deleteRaffle);
router.patch('/:id', authMiddleware, adminMiddleware, adminMiddlewareLimited, raffleController.updateRaffle);
router.put('/:raffleId/regenerate-tickets/:digits', authMiddleware, adminMiddleware, adminMiddlewareLimited, raffleController.regenerateTickets);
router.put('/:id/activate', authMiddleware, adminMiddleware, adminMiddlewareLimited, raffleController.activateRaffle);
router.put('/:id/deactivate', authMiddleware, adminMiddleware, adminMiddlewareLimited, raffleController.deactivateRaffle);


export default router;
