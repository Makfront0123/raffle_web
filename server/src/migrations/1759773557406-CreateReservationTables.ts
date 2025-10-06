import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReservationTables1759773557406 implements MigrationInterface {
    name = 'CreateReservationTables1759773557406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_ada5e865b2350f9acb52b6a8552\``);
        await queryRunner.query(`ALTER TABLE \`payment_details\` DROP FOREIGN KEY \`FK_99a7c566d19127f369c4697dd78\``);
        await queryRunner.query(`CREATE TABLE \`reservation_tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reservationId\` int NULL, \`ticketIdTicket\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expires_at\` timestamp NOT NULL, \`userId\` int NULL, \`raffleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`purchased_at\` \`purchased_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_ada5e865b2350f9acb52b6a8552\` FOREIGN KEY (\`providerId\`) REFERENCES \`providers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_details\` ADD CONSTRAINT \`FK_3f00b85ef045205d509cbd98e7a\` FOREIGN KEY (\`ticketId\`) REFERENCES \`tickets\`(\`id_ticket\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` ADD CONSTRAINT \`FK_373bfd4f1d0c073befb10775002\` FOREIGN KEY (\`reservationId\`) REFERENCES \`reservations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` ADD CONSTRAINT \`FK_fc0d57254575362ba41d0e09b68\` FOREIGN KEY (\`ticketIdTicket\`) REFERENCES \`tickets\`(\`id_ticket\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservations\` ADD CONSTRAINT \`FK_aa0e1cc2c4f54da32bf8282154c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservations\` ADD CONSTRAINT \`FK_cfe6490c94ece50a103551b8a33\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservations\` DROP FOREIGN KEY \`FK_cfe6490c94ece50a103551b8a33\``);
        await queryRunner.query(`ALTER TABLE \`reservations\` DROP FOREIGN KEY \`FK_aa0e1cc2c4f54da32bf8282154c\``);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` DROP FOREIGN KEY \`FK_fc0d57254575362ba41d0e09b68\``);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` DROP FOREIGN KEY \`FK_373bfd4f1d0c073befb10775002\``);
        await queryRunner.query(`ALTER TABLE \`payment_details\` DROP FOREIGN KEY \`FK_3f00b85ef045205d509cbd98e7a\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_ada5e865b2350f9acb52b6a8552\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`purchased_at\` \`purchased_at\` datetime(0) NULL`);
        await queryRunner.query(`DROP TABLE \`reservations\``);
        await queryRunner.query(`DROP TABLE \`reservation_tickets\``);
        await queryRunner.query(`ALTER TABLE \`payment_details\` ADD CONSTRAINT \`FK_99a7c566d19127f369c4697dd78\` FOREIGN KEY (\`ticketId\`) REFERENCES \`tickets\`(\`id_ticket\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_ada5e865b2350f9acb52b6a8552\` FOREIGN KEY (\`providerId\`) REFERENCES \`providers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
