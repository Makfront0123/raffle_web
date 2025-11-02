
import { Payment } from "../entities/payment.entity";
import { AppDataSource } from "../data-source";

export class PaymentRepository {
    async getAllPayments() {
        const paymentRepo = AppDataSource.getRepository(Payment);
        return await paymentRepo.find({ relations: ["user", "raffle"] });
    }

    async getPaymentById(id: number) {
        const paymentRepo = AppDataSource.getRepository(Payment);
        return await paymentRepo.findOne({ where: { id }, relations: ["user", "raffle"] });
    }

    async createPayment(data: Partial<Payment>) {
        const paymentRepo = AppDataSource.getRepository(Payment);
        return await paymentRepo.save(paymentRepo.create(data));
    }

    async updatePayment(id: number, data: Partial<Payment>) {
        const paymentRepo = AppDataSource.getRepository(Payment);
        return await paymentRepo.update(id, data);
    }

    async deletePayment(id: number) {
        const paymentRepo = AppDataSource.getRepository(Payment);
        return await paymentRepo.delete(id);
    }
}