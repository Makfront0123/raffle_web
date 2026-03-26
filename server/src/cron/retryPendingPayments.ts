import { PaymentStatus } from "../entities/payment.entity";
import { PaymentService } from "../services/paymentService";

export async function retryPendingPayments(paymentService: PaymentService) {
    const pending = await paymentService["paymentRepo"].find({
        where: { status: PaymentStatus.PENDING },
    });

    for (const p of pending) {
        await paymentService.verifyPaymentManually(p.reference);
    }
}