
import { Request, Response, NextFunction } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "No Autenticado" });


  if (req.user.role?.id !== 1) return res.status(403).json({ message: "Acceso denegado" });

  next();
}
