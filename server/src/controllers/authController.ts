import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import jwt from "jsonwebtoken";
import axios from "axios";

const authService = new AuthService();

export class AuthController {
  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { token } = req.body; 

      if (!token) {
        return res.status(400).json({ message: "Falta el token de Google" });
      }
 
      const googleUserResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { email, name, picture } = googleUserResponse.data;

      if (!email) {
        return res.status(401).json({ message: "No se pudo obtener el email del usuario" });
      }

      // ✅ Buscamos o creamos el usuario
      const { user, isNew } = await authService.findOrCreateUser({
        name: name!,
        email: email!,
        picture,
      });

   
      const appToken = jwt.sign(
        { id: user.id, email: user.email, roleId: user.role.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: isNew
          ? "Usuario registrado correctamente"
          : "Inicio de sesión exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role.name,
        },
        token: appToken,
      });
    } catch (error: any) {
      console.error("Error en loginWithGoogle:", error.response?.data || error.message);
      return res.status(500).json({
        message: "Error al autenticar con Google",
        error: error.response?.data || error.message,
      });
    }
  }
 
  async persistToken(req: Request, res: Response) {
    try {
       
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      const user = await authService.getUserByToken(token);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role?.name,
        },
      });
    } catch (error: any) {
      console.error("Error en persistToken:", error.message);
      return res.status(401).json({
        message: "Token inválido o expirado",
      });
    }
  }
}