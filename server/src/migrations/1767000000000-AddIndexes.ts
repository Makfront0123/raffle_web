import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767000000000 implements MigrationInterface {
    name = 'AddIndexes1767000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX idx_payments_status_expires 
            ON payments(status, expires_at)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_reservations_expires_at 
            ON reservations(expires_at)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_reservation_tickets_reservationId 
            ON reservation_tickets(reservationId)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX idx_payments_status_expires ON payments`);
        await queryRunner.query(`DROP INDEX idx_reservations_expires_at ON reservations`);
        await queryRunner.query(`DROP INDEX idx_reservation_tickets_reservationId ON reservation_tickets`);
    }
}