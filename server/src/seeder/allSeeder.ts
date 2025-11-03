import { AppDataSource } from "../data-source";
import { Provider } from "../entities/provider.entity";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { Raffle } from "../entities/raffle.entity";
import { Prize } from "../entities/prize.entity";
import { Ticket } from "../entities/ticket.entity";
import { Reservation } from "../entities/reservation.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import { Payment } from "../entities/payment.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import rafflesData from "../data/raffles.json";

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

    const BATCH_SIZE = 1000;

    // 1️⃣ Crear proveedor por defecto
    let defaultProvider = await providerRepo.findOne({ where: { id: 5 } });
    if (!defaultProvider) {
        defaultProvider = providerRepo.create({
            name: "Proveedor por defecto",
            contact_name: "Admin",
            contact_email: "admin@proveedor.com",
            contact_phone: "+1234567890"
        });
        await providerRepo.save(defaultProvider);
    }

    // 2️⃣ Crear rol "user" si no existe
    let userRole = await roleRepo.findOne({ where: { id: 2 } });
    if (!userRole) {
        userRole = roleRepo.create({ id: 2, name: "user" });
        await roleRepo.save(userRole);
    }

    // 3️⃣ Crear usuarios
    const users: User[] = [];
    for (let i = 1; i <= 5; i++) {
        const email = `user${i}@test.com`;
        let user = await userRepo.findOne({ where: { email } });

        if (!user) {
            user = userRepo.create({
                name: `Usuario ${i}`,
                email,
                role: userRole,
                roleId: userRole.id
            });
            await userRepo.save(user);
        }
        users.push(user);
    }

    // 4️⃣ Crear rifas, premios y tickets
    for (const raffleData of rafflesData) {
        const { prizes, ...raffleFields } = raffleData;

        function calculateTotalNumbers(digits: number) {
            return Math.pow(10, digits);
        }

        const raffle = raffleRepo.create({
            ...raffleFields,
            total_numbers: calculateTotalNumbers(raffleFields.digits),
        });
        await raffleRepo.save(raffle);

        // Crear premios asociados
        for (const prizeData of prizes) {
            const prize = prizeRepo.create({
                ...prizeData,
                raffle,
                provider: defaultProvider,
                type: prizeData.type as "cash" | "trip" | "product"
            });
            await prizeRepo.save(prize);
        }

        // Crear tickets en batch
        const totalTickets = Math.pow(10, raffle.digits);
        const ticketsBatch: Ticket[] = [];

        for (let i = 1; i <= totalTickets; i++) {
            const ticketNumber = i.toString().padStart(raffle.digits, "0");

            ticketsBatch.push(
                ticketRepo.create({
                    raffle,
                    raffleId: raffle.id,
                    ticket_number: ticketNumber,
                    status: "available"
                })
            );

            if (ticketsBatch.length === BATCH_SIZE) {
                await ticketRepo.save(ticketsBatch);
                ticketsBatch.length = 0;
            }
        }

        if (ticketsBatch.length > 0) {
            await ticketRepo.save(ticketsBatch);
        }

        console.log(`🎟️ ${totalTickets} tickets creados para la rifa "${raffle.title}"`);

        // 5️⃣ Crear reservas con tickets "reserved"
        const availableForReserve = await ticketRepo.find({
            where: { raffleId: raffle.id, status: "available" },
            take: 5
        });

        for (const ticket of availableForReserve) {
            ticket.status = "reserved";
            await ticketRepo.save(ticket);

            const randomUser = users[getRandomInt(0, users.length - 1)];

            const reservation = reservationRepo.create({
                user: randomUser,
                raffle,
                expires_at: new Date(Date.now() + 30 * 60 * 1000),
            });
            await reservationRepo.save(reservation);

            const resTicket = reservationTicketRepo.create({ reservation, ticket });

            await reservationTicketRepo.save(resTicket);
        }

        // 6️⃣ Crear pagos con tickets "purchased"
        const availableForPurchase = await ticketRepo.find({
            where: { raffleId: raffle.id, status: "available" },
            take: 5
        });

        for (const ticket of availableForPurchase) {
            ticket.status = "purchased";
            ticket.purchased_at = new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000);
            await ticketRepo.save(ticket);

            const randomUser = users[getRandomInt(0, users.length - 1)];

            const payment = paymentRepo.create({
                raffle,
                user: randomUser,
                total_amount: raffle.price,
                status: "completed",
                method: "nequi",
                transaction_id: `TXN${getRandomInt(100000, 999999)}`,
                created_at: ticket.purchased_at
            });
            await paymentRepo.save(payment);

            const detail = paymentDetailRepo.create({ payment, ticket, amount: raffle.price });

            await paymentDetailRepo.save(detail);
        }

        console.log(`💰 Se generaron pagos y reservas para la rifa "${raffle.title}"`);

    }

    console.log("✅ Seeder completo con tickets, reservas y pagos generados correctamente.");
    await AppDataSource.destroy();
}

seedAll().catch(console.error);
