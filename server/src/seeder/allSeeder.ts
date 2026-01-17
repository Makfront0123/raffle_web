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

    /* =========================
       LIMPIEZA TOTAL
    ========================= */
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

    /* =========================
       ROLES
    ========================= */
    let userRole = await roleRepo.findOne({ where: { id: 2 } });
    if (!userRole) {
        userRole = roleRepo.create({ id: 2, name: "user" });
        await roleRepo.save(userRole);
    }

    /* =========================
       PROVIDER
    ========================= */
    const provider = await providerRepo.save(
        providerRepo.create({
            name: "Proveedor Demo",
            contact_name: "Admin",
            contact_email: "admin@proveedor.com",
            contact_phone: "+573000000000",
        })
    );

    /* =========================
    USERS
 ========================= */
    const users: User[] = [];
    const TOTAL_USERS = 100;

    for (let i = 1; i <= TOTAL_USERS; i++) {
        const user = await userRepo.save(
            userRepo.create({
                name: `Usuario ${i}`,
                email: `user${i}@test.com`,
                role: userRole,
                roleId: userRole.id,
            })
        );
        users.push(user);
    }


    /* =========================
       RAFFLES + PRIZES + TICKETS
    ========================= */
    for (const raffleData of rafflesData) {
        const { prizes, ...raffleFields } = raffleData;

        const raffle = await raffleRepo.save(
            raffleRepo.create({
                ...raffleFields,
                end_date: new Date(raffleFields.end_date),
                total_numbers: Math.pow(10, raffleFields.digits),
            })
        );

        // 🎁 Premios
        for (const prizeData of prizes) {
            await prizeRepo.save(
                prizeRepo.create({
                    name: prizeData.name,
                    description: prizeData.description,
                    value: prizeData.value,
                    type: prizeData.type as PrizeType,
                    raffle,
                    provider,
                })
            );
        }

        // 🎟️ Tickets (batch)
        const totalTickets = Math.pow(10, raffle.digits);
        const batch: Ticket[] = [];

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
                batch.length = 0;
            }
        }

        if (batch.length) {
            await ticketRepo.save(batch);
        }

        console.log(`🎯 Rifa creada: ${raffle.title}`);
    }

    /* =========================
     RESERVAS + PAGOS MASIVOS POR USUARIO
  ========================= */

    const availableTickets = await ticketRepo.find({
        where: { status: TicketStatus.AVAILABLE },
        relations: ["raffle"],
        order: { id_ticket: "ASC" },
    });

    const PAYMENTS_PER_USER = 10;

    for (const user of users) {
        for (let p = 0; p < PAYMENTS_PER_USER; p++) {

            // 🎯 Elegir rifa
            const raffle = randomItem(
                [...new Set(availableTickets.map(t => t.raffle))]
            );

            // 🎟️ Tickets disponibles de esa rifa
            const raffleTickets = availableTickets.filter(
                t => t.raffle.id === raffle.id && t.status === "available"
            );

            if (raffleTickets.length < 2) continue;

            // 🧮 Tickets por compra
            const ticketsToBuy = Math.min(
                Math.floor(Math.random() * 5) + 2, // 2–6
                raffleTickets.length
            );

            const selectedTickets = raffleTickets.slice(0, ticketsToBuy);

            // 🔒 Reserva
            const reservation = await reservationRepo.save(
                reservationRepo.create({
                    user,
                    raffle,
                    expires_at: new Date(Date.now() + 30 * 60 * 1000),
                })
            );

            const price = Number(raffle.price);
            let totalAmount = 0;

            for (const ticket of selectedTickets) {
                ticket.status = TicketStatus.HELD;
                ticket.held_until = reservation.expires_at;
                await ticketRepo.save(ticket);

                await reservationTicketRepo.save(
                    reservationTicketRepo.create({
                        reservation,
                        ticket,
                    })
                );

                totalAmount += price;
            }

            // 💳 Pago
            const payment = await paymentRepo.save(
                paymentRepo.create({
                    user,
                    raffle,
                    total_amount: totalAmount,
                    status: PaymentStatus.COMPLETED,
                    reference: `SEED_${user.id}_${raffle.id}_${Date.now()}_${p}`,
                    transaction_id: `TX-${user.id}-${Date.now()}-${p}`,
                })
            );

            // 🧾 Detalles
            for (const ticket of selectedTickets) {
                await paymentDetailRepo.save(
                    paymentDetailRepo.create({
                        payment,
                        ticket,
                        amount: price,
                    })
                );

                ticket.status = TicketStatus.PURCHASED;
                ticket.purchased_at = new Date();
                ticket.held_until = null;
                await ticketRepo.save(ticket);
            }

            // 🧹 Cerrar reserva
            await reservationRepo.delete(reservation.id);
        }
    }

    /* =========================
   RESERVAS EXPIRADAS (SIN PAGO)
========================= */

    for (let i = 0; i < 50; i++) {
        const user = randomItem(users);
        const ticket = availableTickets.find(t => t.status === "available");
        if (!ticket) break;

        const expiresAt = new Date(Date.now() - 10 * 60 * 1000);

        ticket.status = TicketStatus.HELD;
        ticket.held_until = expiresAt;
        await ticketRepo.save(ticket);

        const reservation = await reservationRepo.save(
            reservationRepo.create({
                user,
                raffle: ticket.raffle,
                expires_at: expiresAt,
            })
        );

        await reservationTicketRepo.save(
            reservationTicketRepo.create({
                reservation,
                ticket,
            })
        );
    }


    console.log("🎉 SEED COMPLETO Y FUNCIONAL");
    await AppDataSource.destroy();
}

seedAll().catch(console.error);