import { AppDataSource } from "../data-source";
import { Prize } from "../entities/prize.entity";
import { Ticket } from "../entities/ticket.entity";
import { PrizesService } from "../services/prizesService";


async function ticketSeeder(raffleId: number) {
    await AppDataSource.initialize();

    const ticketRepo = AppDataSource.getRepository(Ticket);
    const prizeRepo = AppDataSource.getRepository(Prize);
    const prizesService = new PrizesService();

    // 1️⃣ Actualizar todos los tickets de la rifa a 'purchased'
    await ticketRepo.update(
        { raffle: { id: raffleId } },
        { status: 'purchased' }
    );

    console.log(`Todos los tickets de la rifa ${raffleId} se marcaron como comprados.`);

    // 2️⃣ Obtener todos los premios de la rifa
    const prizes = await prizeRepo.find({
        where: { raffle: { id: raffleId } },
        relations: ['raffle', 'raffle.tickets', 'raffle.tickets.user']
    });

    // 3️⃣ Seleccionar ganador automáticamente para cada premio
    for (const prize of prizes) {
        const result = await prizesService.selectWinner(prize.id);
        console.log(`Ganador del premio "${prize.name}":`, result.winnerTicket);
    }

    await AppDataSource.destroy();
}

// Llamar al script con el ID de la rifa que quieres probar
ticketSeeder(4).catch(console.error);
