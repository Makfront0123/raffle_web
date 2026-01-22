import { AppDataSource } from "../data-source";
import { Raffle } from "../entities/raffle.entity";
import { Prize, PrizeType } from "../entities/prize.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
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

    const defaultProvider = await providerRepo.findOne({ where: { id: 5 } });
    if (!defaultProvider) {
        throw new Error("No se encontró el proveedor con id 5");
    }

    for (const raffleData of rafflesData) {
        const { prizes, ...raffleFields } = raffleData;
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
                type: prizeData.type as PrizeType,
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
                    status: TicketStatus.AVAILABLE,
                })
            );

            if (ticketsToInsert.length === BATCH_SIZE) {
                await ticketRepo.save(ticketsToInsert);
                ticketsToInsert.length = 0;
            }
        }

        if (ticketsToInsert.length > 0) {
            await ticketRepo.save(ticketsToInsert);
        }



        await ticketRepo.save(tickets);
        console.log(`🎟️ ${tickets.length} tickets generados para la rifa '${raffle.title}'`);
    }

    await AppDataSource.destroy();
}

seedRaffles().catch(console.error);
