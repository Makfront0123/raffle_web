import { Router } from "express";
import { automationRunner } from "../cron/automationRunner";

const router = Router();

router.get("/", async (req, res) => {
    if (!req.headers["x-cron-secret"] ||
        req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    await automationRunner();
    res.json({ status: "ok" });
});
export default router;
