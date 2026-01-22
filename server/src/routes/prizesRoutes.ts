import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrizesController } from '../controllers/prizesController';
import { PrizesService } from '../services/prizesService';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';
import { adminLimiter, cronLimiter, publicLimiter } from '../middleware/limitRequest';
const router = express.Router();
const prizesService = new PrizesService();
const prizesController = new PrizesController(prizesService);


router.get('/', publicLimiter, prizesController.getAllPrizes.bind(prizesController));
router.get('/winners', publicLimiter, prizesController.getWinners.bind(prizesController));
router.get('/:raffleId/winners', publicLimiter, prizesController.getWinnersByRaffle.bind(prizesController));
router.post('/', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, prizesController.createPrize.bind(prizesController));
router.post('/:id/select-winner', adminMiddlewareLimited, cronLimiter, prizesController.selectWinner.bind(prizesController));
router.post('/:raffleId/close-raffle', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, prizesController.closeRaffle.bind(prizesController));
router.delete('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, prizesController.deletePrize.bind(prizesController));
router.patch('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, prizesController.updatePrize.bind(prizesController));



export default router;