import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraints1680000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  SET @constraint_exists = (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND table_name = 'providers'
      AND constraint_name = 'uq_provider_name'
  );

  SET @sql = IF(@constraint_exists = 0,
    'ALTER TABLE providers ADD CONSTRAINT uq_provider_name UNIQUE (name);',
    'SELECT 1;'
  );

  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
`);

    await queryRunner.query(`
      ALTER TABLE raffle
      ADD CONSTRAINT uq_raffle_title UNIQUE (title);
    `);

    await queryRunner.query(`
      ALTER TABLE prizes
      ADD CONSTRAINT uq_prize_name_raffle UNIQUE (name, raffle_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE providers DROP CONSTRAINT uq_provider_name;`);
    await queryRunner.query(`ALTER TABLE raffle DROP CONSTRAINT uq_raffle_title;`);
    await queryRunner.query(`ALTER TABLE prizes DROP CONSTRAINT uq_prize_name_raffle;`);
  }
}