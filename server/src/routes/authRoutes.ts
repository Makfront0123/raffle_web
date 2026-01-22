import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { adminLimiter, authLimiter } from "../middleware/limitRequest";

const router = Router();
const authController = new AuthController();


router.post("/google", authLimiter, (req, res) => authController.loginWithGoogle(req, res));
router.get("/persist", authLimiter, (req, res) => authController.persistToken(req, res));
router.post("/refresh", authLimiter, (req, res) => authController.refreshToken(req, res));
router.post("/logout", authLimiter, (req, res) => authController.logout(req, res));
router.post("/admin/setup", adminLimiter, (req, res) => authController.setupAdmin(req, res));
router.post("/admin/login", adminLimiter, (req, res) => authController.loginAdmin(req, res));




export default router;
