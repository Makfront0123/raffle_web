import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1766896942532 implements MigrationInterface {
    name = 'InitSchema1766896942532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id_ticket\` int NOT NULL AUTO_INCREMENT, \`raffleId\` int NOT NULL, \`ticket_number\` varchar(255) NOT NULL, \`held_until\` timestamp NULL, \`purchased_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('available', 'held', 'reserved', 'purchased') NOT NULL DEFAULT 'available', PRIMARY KEY (\`id_ticket\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`providers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`contact_name\` varchar(255) NOT NULL, \`contact_email\` varchar(255) NOT NULL, \`contact_phone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`prizes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('cash', 'trip', 'product') NOT NULL DEFAULT 'product', \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`value\` decimal(10,2) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`raffleId\` int NULL, \`providerId\` int NULL, \`winnerTicketIdTicket\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservation_tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reservationId\` int NULL, \`ticketIdTicket\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`cancelled_at\` timestamp NULL, \`expires_at\` timestamp NOT NULL, \`userId\` int NULL, \`raffleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`raffle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`total_numbers\` int NOT NULL, \`price\` int NOT NULL, \`status\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`end_date\` timestamp NULL, \`digits\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int NOT NULL, \`paymentId\` int NULL, \`ticketId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reference\` varchar(100) NOT NULL, \`total_amount\` int NOT NULL, \`status\` enum ('pending', 'completed', 'cancelled', 'failed', 'expired') NOT NULL DEFAULT 'pending', \`transaction_id\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`cancelled_at\` timestamp NULL, \`expires_at\` timestamp NULL, \`userId\` int NULL, \`raffleId\` int NULL, UNIQUE INDEX \`IDX_866ddee0e17d9385b4e3b86851\` (\`reference\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`picture\` varchar(255) NULL, \`roleId\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD COLUMN \`password\` varchar(255) NULL AFTER \`email\``);

        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_ba2cde1b114b4701a252659d7e0\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_4c03436b8fa54e1a25b228f0713\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_ada5e865b2350f9acb52b6a8552\` FOREIGN KEY (\`providerId\`) REFERENCES \`providers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prizes\` ADD CONSTRAINT \`FK_04bfcddf6c7c3ae65240be4286e\` FOREIGN KEY (\`winnerTicketIdTicket\`) REFERENCES \`tickets\`(\`id_ticket\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` ADD CONSTRAINT \`FK_373bfd4f1d0c073befb10775002\` FOREIGN KEY (\`reservationId\`) REFERENCES \`reservations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` ADD CONSTRAINT \`FK_fc0d57254575362ba41d0e09b68\` FOREIGN KEY (\`ticketIdTicket\`) REFERENCES \`tickets\`(\`id_ticket\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservations\` ADD CONSTRAINT \`FK_aa0e1cc2c4f54da32bf8282154c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservations\` ADD CONSTRAINT \`FK_cfe6490c94ece50a103551b8a33\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_details\` ADD CONSTRAINT \`FK_314335aaaa5c6df8614559f9aec\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_details\` ADD CONSTRAINT \`FK_3f00b85ef045205d509cbd98e7a\` FOREIGN KEY (\`ticketId\`) REFERENCES \`tickets\`(\`id_ticket\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_d35cb3c13a18e1ea1705b2817b1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_a5d9f2013c9ebe44b6c7ee530d0\` FOREIGN KEY (\`raffleId\`) REFERENCES \`raffle\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_a5d9f2013c9ebe44b6c7ee530d0\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_d35cb3c13a18e1ea1705b2817b1\``);
        await queryRunner.query(`ALTER TABLE \`payment_details\` DROP FOREIGN KEY \`FK_3f00b85ef045205d509cbd98e7a\``);
        await queryRunner.query(`ALTER TABLE \`payment_details\` DROP FOREIGN KEY \`FK_314335aaaa5c6df8614559f9aec\``);
        await queryRunner.query(`ALTER TABLE \`reservations\` DROP FOREIGN KEY \`FK_cfe6490c94ece50a103551b8a33\``);
        await queryRunner.query(`ALTER TABLE \`reservations\` DROP FOREIGN KEY \`FK_aa0e1cc2c4f54da32bf8282154c\``);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` DROP FOREIGN KEY \`FK_fc0d57254575362ba41d0e09b68\``);
        await queryRunner.query(`ALTER TABLE \`reservation_tickets\` DROP FOREIGN KEY \`FK_373bfd4f1d0c073befb10775002\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_04bfcddf6c7c3ae65240be4286e\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_ada5e865b2350f9acb52b6a8552\``);
        await queryRunner.query(`ALTER TABLE \`prizes\` DROP FOREIGN KEY \`FK_4c03436b8fa54e1a25b228f0713\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_ba2cde1b114b4701a252659d7e0\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_866ddee0e17d9385b4e3b86851\` ON \`payments\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`payment_details\``);
        await queryRunner.query(`DROP TABLE \`raffle\``);
        await queryRunner.query(`DROP TABLE \`reservations\``);
        await queryRunner.query(`DROP TABLE \`reservation_tickets\``);
        await queryRunner.query(`DROP TABLE \`prizes\``);
        await queryRunner.query(`DROP TABLE \`providers\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
