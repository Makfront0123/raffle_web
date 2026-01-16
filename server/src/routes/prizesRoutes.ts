import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrizesController } from '../controllers/prizesController';
import { PrizesService } from '../services/prizesService';
import cronMiddleware from '../middleware/cronMiddleware';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';
const router = express.Router();
const prizesService = new PrizesService();
const prizesController = new PrizesController(prizesService);


router.get('/', prizesController.getAllPrizes.bind(prizesController));
router.get('/winners', prizesController.getWinners.bind(prizesController));
router.get('/:raffleId/winners', prizesController.getWinnersByRaffle.bind(prizesController));
router.post('/', authMiddleware, adminMiddleware,adminMiddlewareLimited, prizesController.createPrize.bind(prizesController));
router.post('/:id/select-winner', cronMiddleware,adminMiddlewareLimited, prizesController.selectWinner.bind(prizesController));
router.post('/:raffleId/close-raffle', authMiddleware, adminMiddleware, adminMiddlewareLimited,prizesController.closeRaffle.bind(prizesController));
router.delete('/:id', authMiddleware, adminMiddleware,adminMiddlewareLimited, prizesController.deletePrize.bind(prizesController));
router.patch('/:id', authMiddleware, adminMiddleware, adminMiddlewareLimited,prizesController.updatePrize.bind(prizesController));



export default router;