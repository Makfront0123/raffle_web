import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/authService";
import { roleRepository } from "../repositories/roleRepository";

export class AuthController {
  private authService: AuthService;
  private userRepo: UserRepository;

  constructor(authService?: AuthService, userRepo?: UserRepository) {
    const typeOrmRepo = AppDataSource.getRepository(User);

    this.userRepo = userRepo ?? new UserRepository(typeOrmRepo, roleRepository);
    this.authService =
      authService ?? new AuthService(new UserRepository(typeOrmRepo, roleRepository));
  }

  async setupAdmin(req: Request, res: Response) {
    const { email, password, name, setupKey } = req.body;


    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Clave de instalación inválida" });
    }

    const adminExists = await this.userRepo.existsAdmin(email);
    if (adminExists) {
      return res.status(403).json({ message: "Administrador con este email ya existe" });
    }


    const admin = await this.userRepo.createAdmin({ email, password, name });

    return res.status(201).json({
      message: "Administrador creado correctamente",
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  }

  async loginAdmin(req: Request, res: Response) {
    const { email, password } = req.body;

    const admin = await this.userRepo.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const valid = await this.userRepo.comparePassword(password, admin.password!);
    if (!valid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: admin.id, roleId: admin.role.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({
      message: "Administrador autenticado",
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "admin",
      },
    });
  }



  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Falta el token de Google" });
      }

      const googleUserResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { email, name, picture } = googleUserResponse.data;

      const { user, isNew } =
        await this.authService.findOrCreateUser({ name, email, picture });

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, roleId: user.role?.id || 2 },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
      );
      const isProd = process.env.NODE_ENV === "production";
      const simulateProd = process.env.SIMULATE_PROD === "true";

      const cookieSecure = isProd || simulateProd;

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSecure ? "none" : "lax",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSecure ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });




      return res.status(200).json({
        message: isNew
          ? "Usuario registrado correctamente"
          : "Inicio de sesión exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role?.name || "Usuario",
        },
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
      const token = req.cookies?.access_token;
      if (!token) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = await this.authService.getUserByToken(token);
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
          phone: user.phone_number,
        },
      });
    } catch {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token faltante" });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;

      const user = await this.authService.getUserById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, roleId: user.role.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60,
      });


      return res.json({ message: "Token renovado" });
    } catch {
      return res.status(401).json({
        message: "Refresh token inválido o expirado",
      });
    }
  }
  async logout(req: Request, res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Sesión cerrada correctamente" });
  }

}