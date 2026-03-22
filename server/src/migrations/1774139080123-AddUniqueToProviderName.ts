import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraints1680000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {


    const providerConstraint = await queryRunner.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'providers'
        AND CONSTRAINT_NAME = 'uq_provider_name'
    `);

    if (providerConstraint.length === 0) {
      await queryRunner.query(`
        ALTER TABLE providers
        ADD CONSTRAINT uq_provider_name UNIQUE (name);
      `);
    }


    const raffleConstraint = await queryRunner.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'raffle'
        AND CONSTRAINT_NAME = 'uq_raffle_title'
    `);

    if (raffleConstraint.length === 0) {
      await queryRunner.query(`
        ALTER TABLE raffle
        ADD CONSTRAINT uq_raffle_title UNIQUE (title);
      `);
    }


    const prizeConstraint = await queryRunner.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'prizes'
        AND CONSTRAINT_NAME = 'uq_prize_name_raffle'
    `);

    if (prizeConstraint.length === 0) {
      await queryRunner.query(`
        ALTER TABLE prizes
        ADD CONSTRAINT uq_prize_name_raffle UNIQUE (name, raffle_id);
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      ALTER TABLE providers DROP INDEX uq_provider_name;
    `);

    await queryRunner.query(`
      ALTER TABLE raffle DROP INDEX uq_raffle_title;
    `);

    await queryRunner.query(`
      ALTER TABLE prizes DROP INDEX uq_prize_name_raffle;
    `);
  }
}