import { Router } from "express";
import { automationRunner } from "../cron/automationRunner";

const router = Router();

router.get("/", async (req, res) => {
    try {
        await automationRunner();
        res.json({ status: "ok", message: "Automation runner executed (or skipped by cooldown)" });
    } catch (error: unknown) {
        console.error("[PING-AUTOMATION] error:", error);
        res.status(500).json({ status: "error", error: error instanceof Error ? error.message : error });
    }
});

export default router;
