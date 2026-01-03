import { RaffleService } from "../../services/raffleService";
import { Raffle } from "../../entities/raffle.entity";
import { Ticket, TicketStatus } from "../../entities/ticket.entity";
let fakeRaffleRepo: any;
let fakeTicketRepo: any;
let fakeDataSource: any;

let service: RaffleService;

beforeEach(() => {
    fakeRaffleRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    };
    fakeTicketRepo = {
        create: jest.fn(),
        insert: jest.fn(),
    };

    const fakeQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        },
    };

    fakeDataSource = {
        getRepository: jest.fn((entity) => {
            if (entity === Raffle) return fakeRaffleRepo;
            if (entity === Ticket) return fakeTicketRepo;
        }),
        createQueryRunner: jest.fn(() => fakeQueryRunner),
    };

    service = new RaffleService(
        { raffle: fakeRaffleRepo, ticket: fakeTicketRepo },
        fakeDataSource
    );
});

describe("RaffleService deleteRaffle y regenerateTickets", () => {
    test("deleteRaffle marca rifa como deleting y llama deleteRaffleAsync", async () => {
        const raffle = { id: 1, status: "pending" };
        fakeRaffleRepo.findOne.mockResolvedValue(raffle);
        fakeRaffleRepo.save.mockResolvedValue(raffle);

        const result = await service.deleteRaffle(1);

        expect(fakeRaffleRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(fakeRaffleRepo.save).toHaveBeenCalledWith({ ...raffle, status: "deleting" });
        expect(result.message).toBe("Rifa en proceso de eliminación");
    });

    test("regenerateTickets reemplaza tickets y actualiza rifa", async () => {
        const fakeQueryRunner = fakeDataSource.createQueryRunner();
        const raffle = { id: 2, status: "pending", digits: 2 };

        fakeQueryRunner.manager.findOne.mockResolvedValue(raffle);
        fakeQueryRunner.manager.find.mockResolvedValue([{ status: TicketStatus.AVAILABLE }]);

        fakeQueryRunner.manager.save.mockResolvedValue({});
        fakeQueryRunner.manager.delete.mockResolvedValue({});

        const result = await service.regenerateTickets(2, 3);

        expect(fakeQueryRunner.manager.findOne).toHaveBeenCalledWith(Raffle, { where: { id: 2 } });
        expect(fakeQueryRunner.manager.find).toHaveBeenCalled();
        expect(fakeQueryRunner.manager.delete).toHaveBeenCalledWith(Ticket, { raffle: { id: 2 } });
        expect(result.message).toBe("Tickets regenerados correctamente");
        expect(result.total).toBe(1000);
    });
});
