import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrizesController } from '../controllers/prizesController';
import { PrizesService } from '../services/prizesService';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';
import { adminLimiter, cronLimiter, publicLimiter } from '../middleware/limitRequest';
import { validate } from '../middleware/validate';
import { createPrizeSchema, updatePrizeSchema } from '../schema/prizes.schema';
import { idSchema, raffleIdSchema } from '../schema/common.schema';
const router = express.Router();
const prizesService = new PrizesService();
const prizesController = new PrizesController(prizesService);


router.get('/', publicLimiter, prizesController.getAllPrizes.bind(prizesController));
router.get('/winners', publicLimiter, prizesController.getWinners.bind(prizesController));
router.get('/:raffleId/winners', publicLimiter, validate({ params: raffleIdSchema }), prizesController.getWinnersByRaffle.bind(prizesController));
router.post('/', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ body: createPrizeSchema }), prizesController.createPrize.bind(prizesController));
router.post('/:id/select-winner', adminMiddlewareLimited, cronLimiter, validate({ params: idSchema }), prizesController.selectWinner.bind(prizesController));
router.post('/:raffleId/close-raffle', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: raffleIdSchema }), prizesController.closeRaffle.bind(prizesController));
router.delete('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema }), prizesController.deletePrize.bind(prizesController));
router.patch('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema, body: updatePrizeSchema }), prizesController.updatePrize.bind(prizesController));



export default router;