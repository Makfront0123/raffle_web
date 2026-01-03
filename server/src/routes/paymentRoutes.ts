import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { PaymentService } from "../services/paymentService";
import { AppDataSource } from "../data-source";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { blockAdminMiddleware } from "../middleware/blockAdminMiddleware";

const router = Router();

const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);

router.get("/", authMiddleware, adminMiddleware, paymentController.getAllPayments.bind(paymentController));
router.get("/user", authMiddleware, paymentController.getPaymentUser.bind(paymentController));
router.get("/:id", authMiddleware, paymentController.getPaymentById.bind(paymentController));
router.delete("/:id", authMiddleware, adminMiddleware, paymentController.deletePayment.bind(paymentController));
router.put("/:id", authMiddleware, adminMiddleware, paymentController.updatePayment.bind(paymentController));
router.post("/:id/complete", authMiddleware, adminMiddleware, paymentController.completePayment.bind(paymentController));
router.post("/:id/cancel", authMiddleware, adminMiddleware, paymentController.cancelPayment.bind(paymentController));

router.post("/wompi", authMiddleware, blockAdminMiddleware, paymentController.createWompiPayment.bind(paymentController));
router.post("/wompi/webhook", blockAdminMiddleware, paymentController.wompiWebhook.bind(paymentController));

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



router.post(
  "/seed/complete",
  authMiddleware,
  blockAdminMiddleware,
  (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        message: "Ruta solo disponible en entorno de testing",
      });
    }
    next();
  },
  paymentController.createPayment.bind(paymentController)
);

export default router;
