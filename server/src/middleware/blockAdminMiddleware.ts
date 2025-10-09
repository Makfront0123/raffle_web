import { Request, Response, NextFunction } from 'express';

export const blockAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'No se encontró el usuario' });
    if (user?.role?.name === 'admin') return res.status(403).json({ message: 'No se puede acceder a esta ruta' });
    next();
};
