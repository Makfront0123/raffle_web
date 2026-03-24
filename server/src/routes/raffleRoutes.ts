import express from 'express';
import {
    RaffleController
} from '../controllers/raffleController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminLimiter, authLimiter, publicLimiter } from '../middleware/limitRequest';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';

const router = express.Router();
const raffleController = new RaffleController();

router.get('/', publicLimiter, raffleController.getAllRaffles);
router.post('/', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, raffleController.createRaffle);
router.get('/:id', authMiddleware, authLimiter, raffleController.getRaffleById);
router.delete('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, raffleController.deleteRaffle);
router.patch('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, raffleController.updateRaffle);
router.put('/:raffleId/regenerate-tickets/:digits', authMiddleware, adminLimiter,adminMiddleware, adminMiddlewareLimited, raffleController.regenerateTickets);
router.put('/:id/activate', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, raffleController.activateRaffle);
router.put('/:id/deactivate', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, raffleController.deactivateRaffle);


export default router;
