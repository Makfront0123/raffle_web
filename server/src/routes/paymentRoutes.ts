import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { blockAdminMiddleware } from '../middleware/blockAdminMiddleware';


const router = express.Router();
const paymentController = new PaymentController();

router.post('/', authMiddleware, blockAdminMiddleware, paymentController.createPayment.bind(paymentController));
router.get('/:id', authMiddleware, paymentController.getPaymentById.bind(paymentController));
router.get('/', authMiddleware, paymentController.getAllPayments.bind(paymentController));
router.delete('/:id', authMiddleware, adminMiddleware, paymentController.deletePayment.bind(paymentController));
router.put('/:id', authMiddleware, adminMiddleware, paymentController.updatePayment.bind(paymentController));

router.put('/:id/complete', authMiddleware, adminMiddleware, paymentController.completePayment.bind(paymentController));
router.put('/:id/cancel', authMiddleware, adminMiddleware, paymentController.cancelPayment.bind(paymentController));

export default router;
