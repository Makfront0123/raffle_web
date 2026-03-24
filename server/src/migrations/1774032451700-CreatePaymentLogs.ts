import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentLogs1774032451700 implements MigrationInterface {
    name = "CreatePaymentLogs1774032451700";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE payment_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        payment_id INT NOT NULL,
        event VARCHAR(100) NOT NULL,
        message TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_payment_id (payment_id)
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE payment_logs`);
    }
}