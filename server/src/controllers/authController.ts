import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../data-source";
import { UserRepository } from "../repositories/userRepository";

export class AuthController {
  private authService: AuthService;
  private userRepo: UserRepository;

  constructor(authService?: AuthService, userRepo?: UserRepository) {
    const typeOrmRepo = AppDataSource.getRepository(User);

    this.userRepo = userRepo ?? new UserRepository(typeOrmRepo);

    this.authService =
      authService ?? new AuthService(new UserRepository(typeOrmRepo));
  }


  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ message: "Falta el token de Google" });

      const googleUserResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { email, name, picture } = googleUserResponse.data;

      const { user, isNew } = await this.authService.findOrCreateUser({ name, email, picture });

      // Generar JWT usando roleId seguro
      const appToken = jwt.sign(
        { id: user.id, email: user.email, roleId: user.role?.id || 2 },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: isNew ? "Usuario registrado correctamente" : "Inicio de sesión exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role?.name || "Usuario",
        },
        token: appToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error("Error en login:", error);
      return res.status(500).json({
        message: "Error al autenticar con Google",
        error: error.response?.data || error.message,
      });
    }
  }

  async persistToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ message: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];

      const user = await this.authService.getUserByToken(token);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role?.name,
          phone: user.phone_number,
        },
      });
    } catch {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(400).json({ message: "Falta el refresh token" });

      const valid = await this.authService.verifyRefreshToken(refreshToken);
      if (!valid)
        return res.status(401).json({ message: "Refresh token inválido" });

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;

      const user = await this.authService.getUserById(decoded.id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, roleId: user.role.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return res.json({ token: newAccessToken });
    } catch {
      return res.status(401).json({
        message: "Refresh token inválido o expirado",
      });
    }
  }


}
