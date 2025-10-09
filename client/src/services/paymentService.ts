
export class PaymentService {
    async getAllPayments(): Promise<Payment[]> {
        const response = await fetch("/api/payments");
        if (!response.ok) {
            throw new Error("Error obteniendo pagos");
        }
        const payments = await response.json();
        return payments;
    }
}