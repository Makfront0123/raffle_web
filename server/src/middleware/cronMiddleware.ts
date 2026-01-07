import express from "express";

function cronMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers['x-cron-token'];
  if (token !== process.env.CRON_SECRET) {
    return res.status(403).json({ message: "Forbidden: invalid cron token" });
  }
  next();
}

export default cronMiddleware;
