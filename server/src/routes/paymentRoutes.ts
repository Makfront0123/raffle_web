import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { PaymentService } from "../services/paymentService";
import { AppDataSource } from "../data-source";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { blockAdminMiddleware } from "../middleware/blockAdminMiddleware";
import { adminMiddlewareLimited } from "../middleware/adminMiddlewareLimited";
import express from "express";
import { adminLimiter, paymentActionLimiter, statusLimiter, webhookLimiter } from "../middleware/limitRequest";
const router = Router();

const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);

router.get("/", authMiddleware, adminMiddleware, adminLimiter, paymentController.getAllPayments.bind(paymentController));
router.get("/user", authMiddleware, paymentController.getPaymentUser.bind(paymentController));
router.get("/:id", authMiddleware, adminMiddleware, adminLimiter, paymentController.getPaymentById.bind(paymentController));
router.delete("/:id", authMiddleware, adminMiddleware, adminLimiter, paymentController.deletePayment.bind(paymentController));
router.put("/:id", authMiddleware, adminMiddleware, adminLimiter, paymentController.updatePayment.bind(paymentController));
router.put("/:id/complete", authMiddleware, adminMiddleware, adminMiddlewareLimited, adminLimiter, paymentController.completePayment.bind(paymentController));
router.put("/:id/cancel", authMiddleware, adminMiddleware, adminMiddlewareLimited, adminLimiter, paymentController.cancelPayment.bind(paymentController));


router.post(
  "/cancel/reference/:reference",
  statusLimiter,
  paymentController.cancelPaymentByReference.bind(paymentController)
);

router.post("/wompi", authMiddleware, blockAdminMiddleware, paymentActionLimiter, paymentController.createWompiPayment.bind(paymentController));
router.post(
  "/wompi/webhook",
  express.raw({ type: "*/*" }),
  paymentController.wompiWebhook.bind(paymentController)
);
router.post(
  "/wompi/signature",
  authMiddleware,
  webhookLimiter,
  paymentController.getWompiSignature.bind(paymentController)
);

router.get(
  "/status/:reference",
  statusLimiter,
  paymentController.getPaymentStatusByReference.bind(paymentController)
);


router.post(
  "/whatsapp/receipt",
  authMiddleware,
  paymentActionLimiter,
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
