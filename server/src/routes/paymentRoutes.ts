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

router.get("/", authMiddleware, adminMiddleware, paymentController.getAllPayments.bind(paymentController));
router.get("/user", authMiddleware, paymentController.getPaymentUser.bind(paymentController));
router.post("/", authMiddleware, paymentController.createPayment.bind(paymentController));
router.get("/:id", authMiddleware, paymentController.getPaymentById.bind(paymentController));
router.delete("/:id", paymentController.deletePayment.bind(paymentController));
router.put("/:id", authMiddleware, adminMiddleware, paymentController.updatePayment.bind(paymentController));
router.post("/:id/complete", authMiddleware, adminMiddleware, paymentController.completePayment.bind(paymentController));
router.post("/:id/cancel", authMiddleware, adminMiddleware, paymentController.cancelPayment.bind(paymentController));

router.post("/wompi", authMiddleware, paymentController.createWompiPayment.bind(paymentController));
router.post("/wompi/webhook", paymentController.wompiWebhook.bind(paymentController));

router.post(
    "/wompi/signature",
    authMiddleware,
    paymentController.getWompiSignature.bind(paymentController)
);

router.post(
    "/whatsapp/receipt",
    authMiddleware,
    paymentController.sendWhatsappReceipt.bind(paymentController)
);

export default router;
