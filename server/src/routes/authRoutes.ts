import { Router } from "express";
import { authenticateGoogle } from "../middleware/authenticateGoogle";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const authController = new AuthController();

 
router.post("/google", (req, res) => authController.loginWithGoogle(req, res));
router.get("/persist", (req, res) => authController.persistToken(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));




export default router;
