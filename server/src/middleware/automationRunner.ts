import { Request, Response, NextFunction } from "express";
import { automationRunner } from "../cron/automationRunner";

export async function automationMiddleware(req: Request, res: Response, next: NextFunction) {
    automationRunner().catch(err => {
        console.error("[AUTOMATION] error:", err);
    });
    next();
}
