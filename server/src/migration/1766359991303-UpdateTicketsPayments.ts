import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTicketsPayments1766359991303 implements MigrationInterface {
    name = 'UpdateTicketsPayments1766359991303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`fk_prizes_raffleId\` ON \`prizes\``);
        await queryRunner.query(`DROP INDEX \`FK_a5d9f2013c9ebe44b6c7ee530d0\` ON \`payments\``);

        // Nuevas columnas
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`held_until\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`expires_at\` timestamp NULL`);

        // Asegurar que las columnas existentes reflejen nullable
        await queryRunner.query(`ALTER TABLE \`tickets\` MODIFY \`purchased_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` MODIFY \`cancelled_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` MODIFY \`transaction_id\` text NULL`);

        // Columnas e índices restantes
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`reference\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`reference\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD UNIQUE INDEX \`IDX_866ddee0e17d9385b4e3b86851\` (\`reference\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_4c03436b8fa54e1a25b228f0713\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_a5d9f2013c9ebe44b6c7ee530d0\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_a5d9f2013c9ebe44b6c7ee530d0\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_4c03436b8fa54e1a25b228f0713\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone_number\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP INDEX \`IDX_866ddee0e17d9385b4e3b86851\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`reference\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`reference\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`held_until\``);
        await queryRunner.query(`CREATE INDEX \`FK_a5d9f2013c9ebe44b6c7ee530d0\` ON \`payments\` (\`raffleId\`)`);
        await queryRunner.query(`CREATE INDEX \`fk_prizes_raffleId\` ON \`prizes\` (\`raffleId\`)`);
    }

}
