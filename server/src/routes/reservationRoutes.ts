
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ReservationController } from '../controllers/reservationController';

const router = express.Router();
const reservationController = new ReservationController();

router.get('/', authMiddleware, reservationController.getAllReservations.bind(reservationController));
router.get('/:id', authMiddleware, reservationController.getReservationById.bind(reservationController));
router.post('/', authMiddleware, reservationController.createReservation.bind(reservationController));
router.post("/release-expired", authMiddleware, reservationController.releaseExpiredReservations.bind(reservationController));
router.delete('/:id', authMiddleware, reservationController.deleteReservation.bind(reservationController));


export default router;