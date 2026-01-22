import { Request, Response, NextFunction } from "express";
export function adminMiddlewareLimited(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    if (req.user.role?.id === 1 && req.user.email !== "limited_admin@test.com") {
        return next();
    }
    if (req.user.email === "limited_admin@test.com") {
        if (req.method === "GET") return next();

        const allowedPaths = ["/admin/login", "/logout"];
        if (req.method === "POST" && allowedPaths.includes(req.path)) return next();

        return res.status(403).json({ message: "Acceso limitado" });
    }
    return res.status(403).json({ message: "Acceso denegado" });
}
