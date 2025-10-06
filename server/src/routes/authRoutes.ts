 
import { Router } from "express";
import { authenticateGoogle } from "../middleware/authenticateGoogle";
import { AuthController } from "../controllers/authController";


const router = Router();
const authController = new AuthController();

 
router.get("/google", authenticateGoogle, authController.googleProfile);

export default router;
