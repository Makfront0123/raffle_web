import cron from "node-cron";
import { cleanupExpiredReservations, closeExpiredRaffles } from "./raffleCronLogic";


cron.schedule("*/1 * * * *", async () => {
  console.log("⏰ Ejecutando limpieza de reservas...");
  const removed = await cleanupExpiredReservations();
  console.log(`🧹 Reservas eliminadas: ${removed}`);

  console.log("⏰ Cerrando rifas expiradas...");
  const closed = await closeExpiredRaffles();
  console.log("🎉 Rifas cerradas:", closed);
});
