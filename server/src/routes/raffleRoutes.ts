import express from 'express';
import {
    RaffleController
} from '../controllers/raffleController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminLimiter, authLimiter, publicLimiter } from '../middleware/limitRequest';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';

import { validate } from '../middleware/validate';
import { createRaffleSchema, updateRaffleSchema } from '../schema/raffle.schema';
import { idSchema, regenerateTicketsSchema } from '../schema/common.schema';

const router = express.Router();
const raffleController = new RaffleController();

router.get('/dashboard', authMiddleware, adminMiddleware, raffleController.getDashboard);
router.get('/', publicLimiter, raffleController.getAllRaffles);
router.post('/', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ body: createRaffleSchema }), raffleController.createRaffle);
router.get('/:id', authMiddleware, authLimiter, validate({ params: idSchema }), raffleController.getRaffleById);
router.delete('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema }), raffleController.deleteRaffle);
router.patch('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema, body: updateRaffleSchema }), raffleController.updateRaffle);
router.put('/:raffleId/regenerate-tickets/:digits', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: regenerateTicketsSchema }), raffleController.regenerateTickets);
router.put('/:id/activate', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema }), raffleController.activateRaffle);
router.put('/:id/deactivate', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema }), raffleController.deactivateRaffle);


export default router;
