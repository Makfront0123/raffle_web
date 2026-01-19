import { cleanupExpiredPayments } from "./expirePayments";
import { cleanupExpiredReservations, closeExpiredRaffles } from "./raffleCronLogic";

let lastRun: Date | null = null;

const COOLDOWN_MS = process.env.NODE_ENV === "production"
    ? 1000 * 60 * 60
    : 1000 * 60

export async function automationRunner() {
    const now = new Date();

    if (lastRun && now.getTime() - lastRun.getTime() < COOLDOWN_MS) {
        return;
    }
    await cleanupExpiredPayments();
    await cleanupExpiredReservations();
    await closeExpiredRaffles();

    lastRun = now;
}
