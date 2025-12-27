import { verifyGoogleToken, } from "../services/impl/googleAuthImpl";
import { Request, Response, NextFunction } from "express";
import { GoogleUserData } from "../types/googleAuthService";

// Declaramos que req.user puede ser GoogleUserData
declare global {
  namespace Express {
    interface Request {
      user?: GoogleUserData;
    }
  }
}

export const authenticateGoogle = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ message: 'Token requerido' });

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyGoogleToken(token);
    if (!payload) return res.status(401).json({ message: 'Token inválido' });

    req.user = {
      name: payload.name!,
      email: payload.email!,
      picture: payload.picture,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido', error: err });
  }
};
