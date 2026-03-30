import { AppDataSource } from "../data-source";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
export const cleanupExpiredPayments = async (): Promise<number> => {
    const now = new Date();

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const expiredPayments = await queryRunner.manager
            .createQueryBuilder(Payment, "p")
            .select("p.id", "id")
            .where("p.status = :status", { status: PaymentStatus.PENDING })
            .andWhere("p.expires_at <= :now", { now })
            .getRawMany();

        const paymentIds = expiredPayments.map(p => p.id);

        if (paymentIds.length === 0) {
            await queryRunner.commitTransaction();
            return 0;
        }

        await queryRunner.manager
            .createQueryBuilder()
            .update(Payment)
            .set({ status: PaymentStatus.EXPIRED })
            .whereInIds(paymentIds)
            .execute();

        await queryRunner.manager
            .createQueryBuilder()
            .update(Ticket)
            .set({ status: TicketStatus.AVAILABLE, held_until: null })
            .where(`
                id_ticket IN (
                    SELECT pd.ticketId
                    FROM payment_details pd
                    INNER JOIN payments p ON p.id = pd.paymentId
                    WHERE p.id IN (:...ids)
                )
                AND status = :status
            `, {
                ids: paymentIds,
                status: TicketStatus.HELD,
            })
            .execute();

        await queryRunner.commitTransaction();

        return paymentIds.length;

    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};