import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';


export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No Autenticado" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No Autenticado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleId: number };

    // Traer el usuario con el role cargado
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded.id },
      relations: ['role'],  
    });

    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

    req.user = user;  
    next();
  } catch (error) {
    return res.status(401).json({ message: "No Autenticado", error });
  }
}
