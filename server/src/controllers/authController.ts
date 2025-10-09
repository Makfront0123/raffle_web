import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  async googleProfile(req: Request, res: Response) {
    try {
      const googleUser = req.user;
      if (!googleUser)
        return res.status(401).json({ message: "Usuario no autenticado" });

      const { user, isNew } = await authService.findOrCreateUser({
        name: googleUser.name!,
        email: googleUser.email!,
        picture: googleUser.picture,
      });


      const token = jwt.sign(
        { id: user.id, email: user.email, roleId: user.role.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: isNew ? "Usuario registrado correctamente" : "Inicio de sesión exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role.name,
        },
        token,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        message: "Error interno",
        error: error.message || error,
      });
    }
  }
}
