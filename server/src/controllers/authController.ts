import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import jwt from "jsonwebtoken";
import axios from "axios";

const authService = new AuthService();

export class AuthController {
  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { token } = req.body; // 🔹 Recibimos el access_token

      if (!token) {
        return res.status(400).json({ message: "Falta el token de Google" });
      }

      // ✅ Consultamos la API de Google para obtener el perfil del usuario
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

      // 🔒 Generamos tu JWT interno
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
}





/*
import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const authService = new AuthService();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  // 🔹 Ruta GET (Insomnia o middleware OAuth tradicional)
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

  // 🔹 Ruta POST (frontend con Google Identity)
  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { credential } = req.body;

      if (!credential)
        return res.status(400).json({ message: "Falta el token de Google (credential)" });

      // ✅ Verificar el token de Google
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload)
        return res.status(401).json({ message: "Token inválido o expirado" });

      const { email, name, picture } = payload;

      const { user, isNew } = await authService.findOrCreateUser({
        name: name!,
        email: email!,
        picture,
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
      console.error("Error en loginWithGoogle:", error);
      return res.status(500).json({
        message: "Error al autenticar con Google",
        error: error.message || error,
      });
    }
  }
}

*/