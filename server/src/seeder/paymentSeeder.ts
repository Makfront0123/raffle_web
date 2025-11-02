import { AppDataSource } from "../data-source";
import { Payment } from "../entities/payment.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import { Raffle } from "../entities/raffle.entity";
import { Ticket } from "../entities/ticket.entity";
import { User } from "../entities/user.entity";



export async function seedPayments() {
    const dataSource = AppDataSource;
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);
    const raffleRepo = dataSource.getRepository(Raffle);
    const ticketRepo = dataSource.getRepository(Ticket);
    const paymentRepo = dataSource.getRepository(Payment);
    const detailRepo = dataSource.getRepository(PaymentDetail);

    console.log("🌱 Iniciando seeder de pagos...");

    // 🔹 1️⃣ Buscar usuario, rifa y tickets existentes
    const user = await userRepo.findOne({ where: { id: 1 } });
    const raffle = await raffleRepo.findOne({
        where: { id: 4 },
        relations: ["tickets"],
    });

    if (!user || !raffle) {
        console.error("❌ No se encontró el usuario o la rifa.");
        return;
    }

    // 🔹 2️⃣ Seleccionar algunos tickets (por ejemplo, 2)
    const tickets = await ticketRepo.find({
        where: { raffle: { id: raffle.id } },
        take: 2,
    });

    if (tickets.length === 0) {
        console.error("❌ No se encontraron tickets para la rifa.");
        return;
    }

    // 🔹 3️⃣ Crear el pago principal
    const payment = paymentRepo.create({
        user,
        raffle,
        total_amount: 2.0, // 💵 total (por ejemplo, 2 tickets de $1)
        status: "purchased",
        method: "nequi",
        transaction_id: `TX-${Date.now()}`,
        created_at: new Date(),
    });

    await paymentRepo.save(payment);

    // 🔹 4️⃣ Crear los detalles del pago
    const details = tickets.map((ticket) =>
        detailRepo.create({
            payment,
            ticket,
            amount: 1.0, // 💵 cada ticket vale $1
        })
    );

    await detailRepo.save(details);

    console.log(
        `✅ Pago creado con ${details.length} tickets (${payment.method}) para el usuario ${user.name}`
    );

    await dataSource.destroy();
}
