import { Router } from "express";
import { authenticateGoogle } from "../middleware/authenticateGoogle";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

 
router.post("/google", (req, res) => authController.loginWithGoogle(req, res));
router.get("/persist", (req, res) => authController.persistToken(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));



export default router;
