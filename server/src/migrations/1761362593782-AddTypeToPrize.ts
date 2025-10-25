import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToPrize1761362593782 implements MigrationInterface {
    name = 'AddTypeToPrize1761362593782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_ada5e865b2350f9acb52b6a8552\` ON \`prizes\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD \`type\` enum ('cash', 'trip', 'product') NOT NULL DEFAULT 'product'`);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_ba2cde1b114b4701a252659d7e0\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`raffleId\` \`raffleId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`cancelled_at\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`cancelled_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_ba2cde1b114b4701a252659d7e0\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_ada5e865b2350f9acb52b6a8552\` FOREIGN KEY (\`providerId\`) REFERENCES \`providers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_ada5e865b2350f9acb52b6a8552\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_ba2cde1b114b4701a252659d7e0\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`cancelled_at\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`cancelled_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`raffleId\` \`raffleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_ba2cde1b114b4701a252659d7e0\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP COLUMN \`type\``);
        await queryRunner.query(`CREATE INDEX \`FK_ada5e865b2350f9acb52b6a8552\` ON \`prizes\` (\`providerId\`)`);
    }

}
