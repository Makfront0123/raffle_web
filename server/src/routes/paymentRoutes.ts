import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { PaymentService } from "../services/paymentService";
import { AppDataSource } from "../data-source";

const router = Router();

const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);
 
router.get("/", paymentController.getAllPayments.bind(paymentController));
router.post("/", paymentController.createPayment.bind(paymentController));
router.get("/:id", paymentController.getPaymentById.bind(paymentController));
router.delete("/:id", paymentController.deletePayment.bind(paymentController));
router.put("/:id", paymentController.updatePayment.bind(paymentController));
router.post("/:id/complete", paymentController.completePayment.bind(paymentController));
router.post("/:id/cancel", paymentController.cancelPayment.bind(paymentController));

export default router;
