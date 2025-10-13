import { Router } from "express";
import { authenticateGoogle } from "../middleware/authenticateGoogle";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

// 👉 Para el flujo OAuth tradicional (usado en Insomnia o redirección)
///router.get("/google", authenticateGoogle, authController.googleProfile);

// 👉 Para el nuevo flujo de Google Identity (frontend envía el token)
router.post("/google", (req, res) => authController.loginWithGoogle(req, res));

export default router;
