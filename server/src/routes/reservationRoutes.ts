
import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { ReservationController } from '../controllers/reservationController';
import { blockAdminMiddleware } from '../middleware/blockAdminMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();
const reservationController = new ReservationController();

router.get('/', authMiddleware, adminMiddleware, reservationController.getAllReservations.bind(reservationController));
router.get('/user', authMiddleware, reservationController.getAllReservationsByUser.bind(reservationController));
router.get('/:id', authMiddleware, adminMiddleware, reservationController.getReservationById.bind(reservationController));
router.post('/', authMiddleware, blockAdminMiddleware, reservationController.createReservation.bind(reservationController));
router.post("/release-expired", authMiddleware, reservationController.releaseExpiredReservations.bind(reservationController));
router.delete('/:id', authMiddleware, reservationController.deleteReservation.bind(reservationController));


export default router;