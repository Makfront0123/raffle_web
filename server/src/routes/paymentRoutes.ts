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
import { validate } from "../middleware/validate";
import { createPaymentSchema } from "../schema/payment.schema";
import { idSchema, referenceSchema, whatsappSchema } from "../schema/common.schema";
const router = Router();

const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);

router.get("/", authMiddleware, adminMiddleware, adminLimiter, paymentController.getAllPayments.bind(paymentController));
router.get("/user", authMiddleware, paymentController.getPaymentUser.bind(paymentController));
router.get("/:id", authMiddleware, adminMiddleware, adminLimiter, validate({ params: idSchema }), paymentController.getPaymentById.bind(paymentController));
router.delete("/:id", authMiddleware, adminMiddleware, adminLimiter, validate({ params: idSchema }), paymentController.deletePayment.bind(paymentController));
router.put("/:id/complete", authMiddleware, adminMiddleware, adminMiddlewareLimited, adminLimiter, validate({ params: idSchema }), (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      message: "Ruta solo disponible en entorno de testing",
    });
  }
  next();
}, paymentController.completePayment.bind(paymentController));

router.put("/:id/cancel", authMiddleware, adminMiddleware, adminMiddlewareLimited, adminLimiter, validate({ params: idSchema }), paymentController.cancelPayment.bind(paymentController));
router.get("/:id/logs", authMiddleware, adminMiddleware, adminLimiter, validate({ params: idSchema }), paymentController.getPaymentLogs.bind(paymentController));
router.post("/cancel/reference/:reference", statusLimiter, validate({ params: referenceSchema }), paymentController.cancelPaymentByReference.bind(paymentController));

router.post("/manual/verify/:reference", authMiddleware, adminMiddleware, validate({ params: referenceSchema }), paymentController.verifyPaymentManually.bind(paymentController));

router.post("/wompi", authMiddleware, blockAdminMiddleware, paymentActionLimiter, validate({ body: createPaymentSchema }), paymentController.createWompiPayment.bind(paymentController));
router.post("/wompi/webhook", express.raw({ type: "*/*" }), paymentController.wompiWebhook.bind(paymentController));
router.post("/wompi/signature", authMiddleware, webhookLimiter, paymentController.getWompiSignature.bind(paymentController));

router.get("/status/:reference", statusLimiter, validate({ params: referenceSchema }), paymentController.getPaymentStatusByReference.bind(paymentController));


router.post("/whatsapp/receipt", authMiddleware, paymentActionLimiter, paymentController.sendWhatsappReceipt.bind(paymentController));

router.post("/whatsapp/receipt/validate", authMiddleware, paymentActionLimiter, validate({ body: whatsappSchema }), paymentController.sendWhatsappReceiptController.bind(paymentController));

router.post("/manual/attachTransactionId/:reference", authMiddleware, paymentActionLimiter, validate({ params: referenceSchema }), paymentController.attachTransactionId.bind(paymentController));

router.post("/seed/complete", authMiddleware, blockAdminMiddleware, (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      message: "Ruta solo disponible en entorno de testing",
    });
  }
  next();
},
  paymentController.createPayment.bind(paymentController)
);

router.post(
  "/wompi/test",
  paymentController.createWompiPayment.bind(paymentController)
);

export default router;
