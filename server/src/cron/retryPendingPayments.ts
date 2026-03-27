import { Not, IsNull, MoreThan } from "typeorm";
import { PaymentStatus } from "../entities/payment.entity";
import { PaymentService } from "../services/paymentService";

export async function retryPendingPayments(paymentService: PaymentService) {
    const now = new Date();

    const pending = await paymentService["paymentRepo"].find({
        where: {
            status: PaymentStatus.PENDING,
            transaction_id: Not(IsNull()),
            expires_at: MoreThan(now),
        },
    });

    for (const p of pending) {
        const age = Date.now() - new Date(p.created_at).getTime();

        if (age < 60000) continue;

        try {
            await paymentService.verifyPaymentManually(p.reference);
        } catch (err) {
            console.error("Retry payment failed:", p.reference);
        }
    }
}