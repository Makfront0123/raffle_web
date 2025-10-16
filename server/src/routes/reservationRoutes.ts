
import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { ReservationController } from '../controllers/reservationController';
import { blockAdminMiddleware } from '../middleware/blockAdminMiddleware';

const router = express.Router();
const reservationController = new ReservationController();

router.get('/', authMiddleware, reservationController.getAllReservations.bind(reservationController));
router.get('/user', authMiddleware, reservationController.getAllReservationsByUser.bind(reservationController));
router.get('/:id', authMiddleware, reservationController.getReservationById.bind(reservationController));
router.post('/', authMiddleware, blockAdminMiddleware, reservationController.createReservation.bind(reservationController));
router.post("/release-expired", authMiddleware, reservationController.releaseExpiredReservations.bind(reservationController));
router.delete('/:id', authMiddleware, reservationController.deleteReservation.bind(reservationController));


export default router;