import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767000000000 implements MigrationInterface {
    name = 'AddIndexes1767000000000'

    private async indexExists(
        queryRunner: QueryRunner,
        table: string,
        index: string
    ): Promise<boolean> {
        const result = await queryRunner.query(`
            SELECT 1
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE table_schema = DATABASE()
              AND table_name = '${table}'
              AND index_name = '${index}'
            LIMIT 1;
        `);

        return result.length > 0;
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (!(await this.indexExists(queryRunner, 'payments', 'idx_payments_status_expires'))) {
            await queryRunner.query(`
                CREATE INDEX idx_payments_status_expires 
                ON payments(status, expires_at)
            `);
        }

        if (!(await this.indexExists(queryRunner, 'reservations', 'idx_reservations_expires_at'))) {
            await queryRunner.query(`
                CREATE INDEX idx_reservations_expires_at 
                ON reservations(expires_at)
            `);
        }
        if (!(await this.indexExists(queryRunner, 'reservation_tickets', 'idx_reservation_tickets_reservationId'))) {
            await queryRunner.query(`
                CREATE INDEX idx_reservation_tickets_reservationId 
                ON reservation_tickets(reservationId)
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (await this.indexExists(queryRunner, 'payments', 'idx_payments_status_expires')) {
            await queryRunner.query(`DROP INDEX idx_payments_status_expires ON payments`);
        }

        if (await this.indexExists(queryRunner, 'reservations', 'idx_reservations_expires_at')) {
            await queryRunner.query(`DROP INDEX idx_reservations_expires_at ON reservations`);
        }

        if (await this.indexExists(queryRunner, 'reservation_tickets', 'idx_reservation_tickets_reservationId')) {
            await queryRunner.query(`DROP INDEX idx_reservation_tickets_reservationId ON reservation_tickets`);
        }
    }
}