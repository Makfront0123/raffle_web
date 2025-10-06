import { verifyGoogleToken } from "../services/impl/googleAuthImpl";
import { Request, Response, NextFunction } from "express";

export const authenticateGoogle = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ message: 'Token requerido' });

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyGoogleToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido', error: err });
  }
};
