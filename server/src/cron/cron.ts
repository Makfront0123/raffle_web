import cron from "node-cron";
import { cleanupExpiredReservations, closeExpiredRaffles } from "./raffleCronLogic";
import { cleanupExpiredPayments } from "./expirePayments";
import { retryPendingPayments } from "./retryPendingPayments";
import { PaymentService } from "../services/paymentService";

export function startCronJobs() {
  console.log("Cron jobs iniciados");

  cron.schedule("* * * * *", async () => {
    await cleanupExpiredPayments();
    await closeExpiredRaffles();
  });

  cron.schedule("*/5 * * * *", async () => {
    await cleanupExpiredReservations();
  });

  const paymentService = new PaymentService();

  cron.schedule("*/5 * * * *", async () => {
    await retryPendingPayments(paymentService);
  });

}