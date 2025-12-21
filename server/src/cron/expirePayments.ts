import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Payment } from "../entities/payment.entity";
import { Ticket } from "../entities/ticket.entity";
import { LessThan } from "typeorm";

 
export const cleanupExpiredPayments = async (): Promise<number> => {
    const now = new Date();

    const paymentRepo = AppDataSource.getRepository(Payment);
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const expiredPayments = await paymentRepo.find({
        where: {
            status: "pending",
            expires_at: LessThan(now),
        },
        relations: ["details", "details.ticket"],
    });

    for (const payment of expiredPayments) {
        payment.status = "expired";
        await paymentRepo.save(payment);

        for (const detail of payment.details) {
            detail.ticket.status = "available";
            detail.ticket.held_until = null;
            await ticketRepo.save(detail.ticket);
        }
    }

    return expiredPayments.length;
};

 
export const schedulePaymentCleanup = () => {
    cron.schedule("*/2 * * * *", async () => {
        console.log("⏰ Revisando pagos expirados...");
        try {
            const count = await cleanupExpiredPayments();
            if (count > 0) {
                console.log(`🧹 ${count} pagos expirados liberados`);
            }
        } catch (err) {
            console.error("❌ Error al limpiar pagos expirados:", err);
        }
    });
};
