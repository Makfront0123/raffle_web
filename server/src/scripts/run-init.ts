import { AppDataSource } from "../data-source";
import { InitSchema1766896942532 } from "../migrations/1766896942532-InitSchema";



async function run() {
    await AppDataSource.initialize();

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    const migration = new InitSchema1766896942532();
    await migration.up(queryRunner);

    await queryRunner.release();
    await AppDataSource.destroy();
}

run();