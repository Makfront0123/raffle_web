import { AppDataSource } from "../data-source";
import { Raffle } from "../entities/raffle.entity";
import { Prize } from "../entities/prize.entity";
import { Ticket } from "../entities/ticket.entity";
import { Provider } from "../entities/provider.entity";
import rafflesData from "../data/raffles.json";

async function seedRaffles() {
    await AppDataSource.initialize();
    const raffleRepo = AppDataSource.getRepository(Raffle);
    const prizeRepo = AppDataSource.getRepository(Prize);
    const ticketRepo = AppDataSource.getRepository(Ticket);
    const providerRepo = AppDataSource.getRepository(Provider);

    const BATCH_SIZE = 1000;
    const ticketsToInsert: Ticket[] = [];

    // Obtener el proveedor por defecto (por ejemplo, id = 5)
    const defaultProvider = await providerRepo.findOne({ where: { id: 5 } });
    if (!defaultProvider) {
        throw new Error("❌ No se encontró el proveedor con id 5");
    }

    for (const raffleData of rafflesData) {
        const { prizes, ...raffleFields } = raffleData;

        // Crear la rifa
        // calcula automáticamente el total de números según los dígitos
        function calculateTotalNumbers(digits: number) {
            return Math.pow(10, digits);
        }

        // Crear la rifa
        const raffle = raffleRepo.create({
            ...raffleFields,
            total_numbers: calculateTotalNumbers(raffleFields.digits),
        });
        await raffleRepo.save(raffle);


        // Crear los premios vinculados al proveedor
        for (const prizeData of prizes) {
            const prize = prizeRepo.create({
                ...prizeData,
                raffle,
                provider: defaultProvider,
                type: prizeData.type as "cash" | "trip" | "product",
            });
            await prizeRepo.save(prize);
        }

        // Crear los tickets
        const tickets: Ticket[] = [];
        for (let i = 1; i <= raffle.total_numbers; i++) {
            const ticketNumber = i.toString().padStart(raffle.digits, "0");
            ticketsToInsert.push(
                ticketRepo.create({
                    ticket_number: ticketNumber,
                    raffle,
                    status: "available",
                })
            );

            if (ticketsToInsert.length === BATCH_SIZE) {
                await ticketRepo.save(ticketsToInsert);
                ticketsToInsert.length = 0; // limpiar batch
            }
        }

        // Inserta los que queden al final
        if (ticketsToInsert.length > 0) {
            await ticketRepo.save(ticketsToInsert);
        }



        await ticketRepo.save(tickets);
        console.log(`🎟️ ${tickets.length} tickets generados para la rifa '${raffle.title}'`);
    }

    console.log("✅ Rifas, premios y tickets insertados correctamente.");
    await AppDataSource.destroy();
}

seedRaffles().catch(console.error);


/*
// Crear los tickets en lotes (mejor rendimiento)
const BATCH_SIZE = 1000;
const ticketsToInsert: Ticket[] = [];

for (let i = 1; i <= raffle.total_numbers; i++) {
  const ticketNumber = i.toString().padStart(raffle.digits, "0");
  ticketsToInsert.push(
    ticketRepo.create({
      ticket_number: ticketNumber,
      raffle,
      status: "available",
    })
  );

  if (ticketsToInsert.length === BATCH_SIZE) {
    await ticketRepo.save(ticketsToInsert);
    ticketsToInsert.length = 0; // limpiar batch
  }
}

// Inserta los que queden al final
if (ticketsToInsert.length > 0) {
  await ticketRepo.save(ticketsToInsert);
}

console.log(`🎟️ ${raffle.total_numbers} tickets generados para '${raffle.title}'`);

*/