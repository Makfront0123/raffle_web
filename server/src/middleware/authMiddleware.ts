 
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No Autenticado" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No Autenticado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { id: decoded.id, email: decoded.email, roleId: decoded.roleId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "No Autenticado", error });
  }
}
