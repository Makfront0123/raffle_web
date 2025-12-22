import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrizesController } from '../controllers/prizesController';
import { PrizesService } from '../services/prizesService';

const router = express.Router();
const prizesService = new PrizesService();
const prizesController = new PrizesController(prizesService);

 
router.get('/', prizesController.getAllPrizes.bind(prizesController));
router.post('/', authMiddleware, adminMiddleware, prizesController.createPrize.bind(prizesController));


router.get('/winners', prizesController.getWinners.bind(prizesController));


router.get('/:raffleId/winner', prizesController.getWinner.bind(prizesController));
router.post('/:id/select-winner', prizesController.selectWinner.bind(prizesController));
router.post('/:raffleId/close-raffle', authMiddleware, adminMiddleware, prizesController.closeRaffle.bind(prizesController));

router.delete('/:id', authMiddleware, adminMiddleware, prizesController.deletePrize.bind(prizesController));
router.patch('/:id', authMiddleware, adminMiddleware, prizesController.updatePrize.bind(prizesController));



export default router;