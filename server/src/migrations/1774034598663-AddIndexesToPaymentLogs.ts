import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesToPaymentLogs1774034598663 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE INDEX idx_payment_logs_created_at 
      ON payment_logs(created_at);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_payment_logs_payment_created 
      ON payment_logs(payment_id, created_at);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DROP INDEX idx_payment_logs_created_at ON payment_logs;
    `);

        await queryRunner.query(`
      DROP INDEX idx_payment_logs_payment_created ON payment_logs;
    `);
    }
}