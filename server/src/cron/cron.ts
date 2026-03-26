import cron from "node-cron";
import { cleanupExpiredReservations, closeExpiredRaffles } from "./raffleCronLogic";
import { cleanupExpiredPayments } from "./expirePayments";
import { retryPendingPayments } from "./retryPendingPayments";

export function startCronJobs() {
  console.log("Cron jobs iniciados");

  cron.schedule("* * * * *", async () => {
    await cleanupExpiredPayments();
    await closeExpiredRaffles();
  });

  cron.schedule("*/5 * * * *", async () => {
    await cleanupExpiredReservations();
  });

}