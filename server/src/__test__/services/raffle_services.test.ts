import { RaffleService } from "../../services/raffleService";
import { Raffle } from "../../entities/raffle.entity";
import { Ticket } from "../../entities/ticket.entity";
import { createFakeRepository } from "../utils/createFakeDataSource";
import { PrizeType } from "../../entities/prize.entity";

let fakeRaffleRepo: any;
let fakeTicketRepo: any;
let fakeDataSource: any;

let service: RaffleService;

describe("RaffleService (sin BD)", () => {
    beforeEach(() => {
        fakeRaffleRepo = createFakeRepository<Raffle>();
        fakeTicketRepo = createFakeRepository<Ticket>();

        fakeDataSource = {
            getRepository: (entity: any) => {
                if (entity === Raffle) return fakeRaffleRepo;
                if (entity === Ticket) return fakeTicketRepo;
            }
        };

        service = new RaffleService(
            { raffle: fakeRaffleRepo, ticket: fakeTicketRepo },
            fakeDataSource
        );
    });

    test("createRaffle crea correctamente y genera tickets", async () => {
        const data = {
            title: "Mi rifa",
            description: "Descripción prueba",
            price: 5000,
            end_date: "2025-12-31",
            digits: 2,
            type: PrizeType.CASH,
        };

        const result = await service.createRaffle(data);

        expect(result.message).toBe("Rifa creada correctamente");
        expect(result.raffle.id).toBe(1);
        expect(result.totalTickets).toBe(100); 
        expect(fakeRaffleRepo.__data.length).toBe(1);
        expect(fakeTicketRepo.__data.length).toBe(100);
    });

    test("activateRaffle activa una rifa pendiente", async () => {
        const raffle = await fakeRaffleRepo.save({
            id: 2,
            status: "pending",
            end_date: new Date(Date.now() + 86400000),
            prizes: [{}]
        });

        const result = await service.activateRaffle(2);

        expect(result.message).toBe("Rifa activada correctamente");
        expect(result.raffle.status).toBe("active");
    });

    test("activateRaffle falla si no tiene premios", async () => {
        await fakeRaffleRepo.save({
            id: 3,
            status: "pending",
            end_date: new Date(Date.now() + 86400000),
            prizes: []
        });

        await expect(service.activateRaffle(3)).rejects.toThrow("No hay premios para activar la rifa");
    });

 
    test("deactivateRaffle desactiva una rifa activa", async () => {
        await fakeRaffleRepo.save({
            id: 4,
            status: "active",
            tickets: []
        });

        const result = await service.deactivateRaffle(4);

        expect(result.raffle.status).toBe("pending");
        expect(result.message).toBe("La rifa se ha desactivado correctamente");
    });


    test("getRaffleById obtiene correctamente", async () => {
        await fakeRaffleRepo.save({
            id: 5,
            title: "Rifa test",
            prizes: [],
            tickets: []
        });

        const result = await service.getRaffleById(5);

        expect(result?.id).toBe(5);
        expect(result?.title).toBe("Rifa test");
    });

    test("deleteRaffle elimina si no está activa", async () => {
        await fakeRaffleRepo.save({
            id: 6,
            status: "pending",
            tickets: []
        });

        const result = await service.deleteRaffle(6);

        expect(result.message).toBe("Rifa #6 eliminada correctamente");
        expect(fakeRaffleRepo.__data.length).toBe(0);
    });

    test("deleteRaffle falla si está activa", async () => {
        await fakeRaffleRepo.save({
            id: 7,
            status: "active",
            tickets: []
        });

        await expect(service.deleteRaffle(7)).rejects.toThrow("La rifa está activa, no se puede eliminar");
    });
    test("updateRaffle actualiza correctamente", async () => {
        await fakeRaffleRepo.save({
            id: 8,
            status: "pending",
            title: "Viejo",
            description: "Desc",
            price: 5000
        });

        const result = await service.updateRaffle(8, {
            title: "Nuevo título"
        });

        expect(result.message).toBe("Rifa actualizada correctamente");
        expect(result.raffle?.title).toBe("Nuevo título");
    });
});
