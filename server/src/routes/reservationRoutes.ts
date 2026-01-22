
import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { ReservationController } from '../controllers/reservationController';
import { blockAdminMiddleware } from '../middleware/blockAdminMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { adminLimiter, authLimiter } from '../middleware/limitRequest';

const router = express.Router();
const reservationController = new ReservationController();

router.get('/', authMiddleware, authLimiter, adminMiddleware, reservationController.getAllReservations.bind(reservationController));
router.get('/user', authMiddleware, authLimiter, reservationController.getAllReservationsByUser.bind(reservationController));
router.get('/:id', authMiddleware, adminLimiter, adminMiddleware, reservationController.getReservationById.bind(reservationController));
router.post('/', authMiddleware, authLimiter, blockAdminMiddleware, reservationController.createReservation.bind(reservationController));
router.post("/release-expired", authMiddleware, authLimiter, reservationController.releaseExpiredReservations.bind(reservationController));
router.delete('/:id', authMiddleware, authLimiter, reservationController.deleteReservation.bind(reservationController));


export default router;