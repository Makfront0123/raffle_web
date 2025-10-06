import express from 'express';
import {
    RaffleController
} from '../controllers/raffleController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const raffleController = new RaffleController();

router.get('/', authMiddleware, raffleController.getAllRaffles);
router.post('/', authMiddleware, adminMiddleware, raffleController.createRaffle);
router.get('/:id', authMiddleware, raffleController.getRaffleById);
router.delete('/:id', authMiddleware, adminMiddleware, raffleController.deleteRaffle);
router.put('/:id', authMiddleware, adminMiddleware, raffleController.updateRaffle);


export default router;
