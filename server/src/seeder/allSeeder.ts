import { AppDataSource } from "../data-source";
import { Provider } from "../entities/provider.entity";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { Raffle } from "../entities/raffle.entity";
import { Prize, PrizeType } from "../entities/prize.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { Reservation } from "../entities/reservation.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { PaymentDetail } from "../entities/payment_details.entity";

import rafflesData from "../data/raffles.json";

const BATCH_SIZE = 1000;

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedAll() {
    await AppDataSource.initialize();

    const providerRepo = AppDataSource.getRepository(Provider);
    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);
    const raffleRepo = AppDataSource.getRepository(Raffle);
    const prizeRepo = AppDataSource.getRepository(Prize);
    const ticketRepo = AppDataSource.getRepository(Ticket);
    const reservationRepo = AppDataSource.getRepository(Reservation);
    const reservationTicketRepo = AppDataSource.getRepository(ReservationTicket);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const paymentDetailRepo = AppDataSource.getRepository(PaymentDetail);

    console.log("🧹 Limpiando base de datos...");

    await AppDataSource.query(`SET FOREIGN_KEY_CHECKS=0`);
    await AppDataSource.query(`TRUNCATE payment_details`);
    await AppDataSource.query(`TRUNCATE payments`);
    await AppDataSource.query(`TRUNCATE reservation_tickets`);
    await AppDataSource.query(`TRUNCATE reservations`);
    await AppDataSource.query(`TRUNCATE tickets`);
    await AppDataSource.query(`TRUNCATE prizes`);
    await AppDataSource.query(`TRUNCATE raffle`);
    await AppDataSource.query(`TRUNCATE providers`);
    await AppDataSource.query(`DELETE FROM users WHERE roleId = 2`);
    await AppDataSource.query(`SET FOREIGN_KEY_CHECKS=1`);

    /* ========================= ROLES ========================= */
    let userRole = await roleRepo.findOne({ where: { id: 2 } });
    if (!userRole) {
        userRole = await roleRepo.save({ id: 2, name: "user" });
    }

    /* ========================= PROVIDER ========================= */
    const provider = await providerRepo.save({
        name: "Proveedor Demo",
        contact_name: "Admin",
        contact_email: "admin@proveedor.com",
        contact_phone: "+573000000000",
    });

    /* ========================= USERS (BATCH) ========================= */
    const TOTAL_USERS = 100;

    const usersToInsert: User[] = [];
    for (let i = 1; i <= TOTAL_USERS; i++) {
        usersToInsert.push(
            userRepo.create({
                name: `Usuario ${i}`,
                email: `user${i}@test.com`,
                role: userRole,
                roleId: userRole.id,
            })
        );
    }

    const users = await userRepo.save(usersToInsert);

    /* ========================= RAFFLES + PRIZES + TICKETS ========================= */
    for (const raffleData of rafflesData) {
        const { prizes, ...raffleFields } = raffleData;

        const raffle = await raffleRepo.save({
            ...raffleFields,
            end_date: new Date(raffleFields.end_date),
            total_numbers: Math.pow(10, raffleFields.digits),
        });

        // PRIZES (batch)
        const prizesToInsert = prizes.map(p =>
            prizeRepo.create({
                ...p,
                type: p.type as PrizeType,
                raffle,
                provider,
            })
        );

        await prizeRepo.save(prizesToInsert);

        // TICKETS (batch)
        const totalTickets = Math.pow(10, raffle.digits);
        let batch: Ticket[] = [];

        for (let i = 1; i <= totalTickets; i++) {
            batch.push(
                ticketRepo.create({
                    raffle,
                    raffleId: raffle.id,
                    ticket_number: i.toString().padStart(raffle.digits, "0"),
                    status: TicketStatus.AVAILABLE,
                })
            );

            if (batch.length === BATCH_SIZE) {
                await ticketRepo.save(batch);
                batch = [];
            }
        }

        if (batch.length) {
            await ticketRepo.save(batch);
        }

        console.log(`🎯 Rifa creada: ${raffle.title}`);
    }

    /* ========================= TICKETS DISPONIBLES ========================= */
    const availableTickets = await ticketRepo.find({
        where: { status: TicketStatus.AVAILABLE },
        relations: ["raffle"],
    });

    // 🔥 Agrupar por rifa (evita O(n²))
    const ticketsByRaffle = new Map<number, Ticket[]>();
    for (const t of availableTickets) {
        if (!ticketsByRaffle.has(t.raffle.id)) {
            ticketsByRaffle.set(t.raffle.id, []);
        }
        ticketsByRaffle.get(t.raffle.id)!.push(t);
    }

    const raffles = Array.from(ticketsByRaffle.keys());

    /* ========================= RESERVAS + PAGOS ========================= */
    const PAYMENTS_PER_USER = 10;

    for (const user of users) {
        for (let p = 0; p < PAYMENTS_PER_USER; p++) {
            const raffleId = randomItem(raffles);
            const raffleTickets = ticketsByRaffle.get(raffleId)!;

            if (raffleTickets.length < 2) continue;

            const ticketsToBuy = Math.min(
                Math.floor(Math.random() * 5) + 2,
                raffleTickets.length
            );

            const selectedTickets = raffleTickets.splice(0, ticketsToBuy);

            const reservation = await reservationRepo.save({
                user,
                raffle: selectedTickets[0].raffle,
                expires_at: new Date(Date.now() + 30 * 60 * 1000),
            });

            const price = Number(selectedTickets[0].raffle.price);
            const totalAmount = price * selectedTickets.length;

            await ticketRepo.update(
                selectedTickets.map(t => t.id_ticket),
                {
                    status: TicketStatus.HELD,
                    held_until: reservation.expires_at,
                }
            );
            await reservationTicketRepo.save(
                selectedTickets.map(ticket =>
                    reservationTicketRepo.create({ reservation, ticket })
                )
            );

            const payment = await paymentRepo.save({
                user,
                raffle: selectedTickets[0].raffle,
                total_amount: totalAmount,
                status: PaymentStatus.COMPLETED,
                reference: `SEED_${user.id}_${raffleId}_${Date.now()}_${p}`,
                transaction_id: `TX-${user.id}-${Date.now()}-${p}`,
            });

            await paymentDetailRepo.save(
                selectedTickets.map(ticket =>
                    paymentDetailRepo.create({
                        payment,
                        ticket,
                        amount: price,
                    })
                )
            );
            await ticketRepo.update(
                selectedTickets.map(t => t.id_ticket),
                {
                    status: TicketStatus.PURCHASED,
                    purchased_at: new Date(),
                    held_until: null,
                }
            );

            await reservationRepo.delete(reservation.id);
        }
    }

    /* ========================= RESERVAS EXPIRADAS ========================= */
    for (let i = 0; i < 50; i++) {
        const user = randomItem(users);

        const raffleId = randomItem(raffles);
        const raffleTickets = ticketsByRaffle.get(raffleId)!;

        if (!raffleTickets.length) continue;

        const ticket = raffleTickets.shift()!;
        const expiresAt = new Date(Date.now() - 10 * 60 * 1000);

        await ticketRepo.update(ticket.id_ticket, {
            status: TicketStatus.HELD,
            held_until: expiresAt,
        });

        const reservation = await reservationRepo.save({
            user,
            raffle: ticket.raffle,
            expires_at: expiresAt,
        });

        await reservationTicketRepo.save({
            reservation,
            ticket,
        });
    }

    console.log("SEED COMPLETO Y OPTIMIZADO");
    await AppDataSource.destroy();
}

seedAll().catch(console.error);