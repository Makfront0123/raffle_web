import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { PaymentService } from "../services/paymentService";
import { AppDataSource } from "../data-source";
import { auth } from "google-auth-library";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);

router.get("/", authMiddleware, paymentController.getAllPayments.bind(paymentController));
router.post("/", authMiddleware, paymentController.createPayment.bind(paymentController));
router.get("/:id", authMiddleware, paymentController.getPaymentById.bind(paymentController));
router.delete("/:id", paymentController.deletePayment.bind(paymentController));
router.put("/:id", adminMiddleware, paymentController.updatePayment.bind(paymentController));
router.post("/:id/complete", adminMiddleware, paymentController.completePayment.bind(paymentController));
router.post("/:id/cancel", adminMiddleware, paymentController.cancelPayment.bind(paymentController));

router.post("/wompi", authMiddleware, paymentController.createWompiPayment.bind(paymentController));
router.post("/wompi/webhook", paymentController.wompiWebhook.bind(paymentController));

router.post(
    "/wompi/signature",
    authMiddleware,
    paymentController.getWompiSignature.bind(paymentController)
);



export default router;
