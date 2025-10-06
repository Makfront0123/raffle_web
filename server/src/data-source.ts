import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { Raffle } from "./entities/raffle.entity";
import { Ticket } from "./entities/ticket.entity";
import { Payment } from "./entities/payment.entity";
import { Prize } from "./entities/prize.entity";
import { Provider } from "./entities/provider.entity";
import { PaymentDetail } from "./entities/payment_details.entity";

import * as dotenv from "dotenv";
import { Reservation } from "./entities/reservation.entity";
import { ReservationTicket } from "./entities/reservation_ticket.entity";

dotenv.config(); // 🔑 Cargar variables de .env

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Role, Raffle, Ticket, Payment, Prize, Provider, PaymentDetail, Reservation, ReservationTicket],
    synchronize: false, // ❌ En producción, siempre falso
    migrations: ["src/migrations/*.ts"],
    logging: true,
});


/*
npm run migration:generate CreateInitialTables
npm run migration:run

*/