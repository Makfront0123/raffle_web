import cron from "node-cron";
import { cleanupExpiredReservations, closeExpiredRaffles } from "./raffleCronLogic";
import { cleanupExpiredPayments } from "./expirePayments";

export function startCronJobs() {
  console.log("Cron jobs iniciados");

  cron.schedule("* * * * *", async () => {
    await cleanupExpiredPayments();
  });

  cron.schedule("*/5 * * * *", async () => {
    await cleanupExpiredReservations();
  });

  cron.schedule("*/10 * * * *", async () => {
    await closeExpiredRaffles();
  });
}