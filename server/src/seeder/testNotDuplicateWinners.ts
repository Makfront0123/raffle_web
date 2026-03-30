import { closeExpiredRaffles } from "../cron/raffleCronLogic";
import { AppDataSource } from "../data-source";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import { Prize, PrizeType } from "../entities/prize.entity";
import { Raffle } from "../entities/raffle.entity";
import { Role } from "../entities/role.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { User } from "../entities/user.entity";
import { PrizesService } from "../services/prizesService";

async function seedTestNoDuplicateWinners() {
    await AppDataSource.initialize();

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);
    const raffleRepo = AppDataSource.getRepository(Raffle);
    const prizeRepo = AppDataSource.getRepository(Prize);
    const ticketRepo = AppDataSource.getRepository(Ticket);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const paymentDetailRepo = AppDataSource.getRepository(PaymentDetail);

    console.log("🧪 TEST: No duplicate winners");

    /* =========================
       LIMPIEZA CONTROLADA (NO BOMBA 💣)
    ========================= */
    await AppDataSource.query(`SET FOREIGN_KEY_CHECKS=0`);
    await AppDataSource.query(`DELETE FROM payment_details`);
    await AppDataSource.query(`DELETE FROM payments`);
    await AppDataSource.query(`DELETE FROM tickets`);
    await AppDataSource.query(`DELETE FROM prizes`);
    await AppDataSource.query(`DELETE FROM raffle`);
    await AppDataSource.query(`DELETE FROM users WHERE roleId = 2`);
    await AppDataSource.query(`SET FOREIGN_KEY_CHECKS=1`);

    /* =========================
       ROLE USER
    ========================= */
    let userRole = await roleRepo.findOne({ where: { id: 2 } });
    if (!userRole) {
        userRole = await roleRepo.save({
            id: 2,
            name: "user",
        });
    }

    /* =========================
       USUARIO (SOLO 1)
    ========================= */
    const user = await userRepo.save(
        userRepo.create({
            name: "Test User",
            email: `test_${Date.now()}@test.com`, // evita duplicados
            roleId: userRole.id,
        })
    );

    /* =========================
       RIFA PEQUEÑA (10 tickets)
    ========================= */
    const raffle = await raffleRepo.save(
        raffleRepo.create({
            title: "Rifa Test",
            description: "Test no duplicate winners",
            digits: 1,
            total_numbers: 10,
            price: 1000,
            status: "active",
            end_date: new Date(Date.now() - 1000), // expirada
        })
    );

    /* =========================
       PREMIOS (3)
    ========================= */
    const prizes: Prize[] = [];

    for (let i = 1; i <= 3; i++) {
        const prize = await prizeRepo.save(
            prizeRepo.create({
                name: `Premio ${i}`,
                raffle,
                description: 'sadasdsad',
                value: 1000,
                type: PrizeType.PRODUCT,
            })
        );
        prizes.push(prize);
    }

    /* =========================
       TICKETS (10)
    ========================= */
    const tickets: Ticket[] = [];

    for (let i = 1; i <= 10; i++) {
        const ticket = await ticketRepo.save(
            ticketRepo.create({
                raffle,
                raffleId: raffle.id,
                ticket_number: i.toString(),
                status: TicketStatus.AVAILABLE,
            })
        );
        tickets.push(ticket);
    }

    /* =========================
       COMPRAR 5 TICKETS
    ========================= */
    const purchasedTickets = tickets.slice(0, 5);

    const payment = await paymentRepo.save(
        paymentRepo.create({
            user,
            raffle,
            total_amount: 5000,
            status: PaymentStatus.COMPLETED,
            reference: `TEST_${Date.now()}`,
        })
    );

    for (const ticket of purchasedTickets) {
        ticket.status = TicketStatus.PURCHASED;
        ticket.purchased_at = new Date();
        await ticketRepo.save(ticket);

        await paymentDetailRepo.save(
            paymentDetailRepo.create({
                payment,
                ticket,
                amount: 1000,
            })
        );
    }

    console.log("Ejecutando selección de ganadores...");

    const prizeService = new PrizesService();

    await closeExpiredRaffles(prizeService);

    /* =========================
       VALIDACIÓN
    ========================= */
    const winners = await prizeRepo.find({
        where: { raffle: { id: raffle.id } },
        relations: ["winner_ticket"],
    });

    const ticketIds = winners
        .map(p => p.winner_ticket?.id_ticket)
        .filter(Boolean);

    console.log("Tickets ganadores:", ticketIds);

    const unique = new Set(ticketIds);

    if (unique.size !== ticketIds.length) {
        console.error("DUPLICADOS DETECTADOS");
    } else {
        console.log("SIN DUPLICADOS (CORRECTO)");
    }

    await AppDataSource.destroy();
}

seedTestNoDuplicateWinners().catch(console.error);