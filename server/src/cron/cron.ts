import cron from "node-cron";
import { cleanupExpiredReservations, closeExpiredRaffles } from "./raffleCronLogic";
import { cleanupExpiredPayments } from "./expirePayments";

cron.schedule("* * * * *", async () => {
  console.log("Ejecutando limpieza de reservas...");
  const removed = await cleanupExpiredReservations();
  console.log(`Reservas eliminadas: ${removed}`);


  const expiredPayments = await cleanupExpiredPayments();
  console.log(`Pagos expirados liberados: ${expiredPayments}`);


  console.log("Cerrando rifas expiradas...");
  const closed = await closeExpiredRaffles();
  console.log("Rifas cerradas:", closed);
});
