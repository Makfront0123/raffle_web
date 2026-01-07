import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();


router.post("/google", (req, res) => authController.loginWithGoogle(req, res));
router.get("/persist", (req, res) => authController.persistToken(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.post("/admin/setup", (req, res) => authController.setupAdmin(req, res));
router.post("/admin/login", (req, res) => authController.loginAdmin(req, res));




export default router;
