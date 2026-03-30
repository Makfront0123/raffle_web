jest.mock("../../data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
        createQueryRunner: jest.fn(),
    },
}));

jest.mock("../../services/prizesService", () => ({
    PrizesService: jest.fn().mockImplementation(() => ({
        selectWinner: jest.fn(),
    })),
}));

jest.mock("../../utils/sendEmail", () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));

import { AppDataSource } from "../../data-source";
import { cleanupExpiredReservations, closeExpiredRaffles } from "../../cron/raffleCronLogic";
import { PrizesService } from "../../services/prizesService";
import { Prize } from "../../entities/prize.entity";
import { Reservation } from "../../entities/reservation.entity";
import { Ticket } from "../../entities/ticket.entity";

jest.mock("../../data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
        createQueryRunner: jest.fn(),
        createQueryBuilder: jest.fn(), // 👈 🔥 ESTE FALTABA
    },
}));
const createMockQueryBuilder = () => ({
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
});

const mockReservationRepo = {
    createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
};

const mockTicketRepo = {
    createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
};

const mockRaffleRepo = {
    find: jest.fn(),
};

const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
        save: jest.fn(),
        find: jest.fn(),
        createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
    },
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
    if (entity === Reservation) return mockReservationRepo;
    if (entity === Ticket) return mockTicketRepo;
    if (entity === Prize) return mockRaffleRepo;
    return mockRaffleRepo;
});

(AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(mockQueryRunner);

(AppDataSource.createQueryBuilder as jest.Mock).mockImplementation(() =>
    createMockQueryBuilder()
);

const prizeServiceMock = new (PrizesService as any)();

beforeEach(() => {
    jest.clearAllMocks();
});

describe("cleanupExpiredReservations", () => {
    it("libera tickets y elimina reservas expiradas", async () => {
        const result = await cleanupExpiredReservations();

        expect(result).toBe(1);

        // Validamos que se ejecutaron queries
        expect(mockTicketRepo.createQueryBuilder).toHaveBeenCalled();
        expect(mockReservationRepo.createQueryBuilder).toHaveBeenCalled();
    });
});

describe("closeExpiredRaffles", () => {
    it("cierra rifas expiradas y asigna ganadores", async () => {
        mockRaffleRepo.find.mockResolvedValue([
            { id: 1, status: "active", tickets: [] },
        ]);

        mockQueryRunner.manager.find.mockResolvedValue([
            { id: 50, name: "Premio 1" },
            { id: 51, name: "Premio 2" },
        ]);

        prizeServiceMock.selectWinner.mockResolvedValue({
            winnerTicket: {
                id_ticket: 10,
                ticket_number: 123,
                user: { email: "test@mail.com", name: "Juan" },
            },
            prizeName: "Premio X",
        });

        const res = await closeExpiredRaffles(prizeServiceMock);

        expect(mockRaffleRepo.find).toHaveBeenCalled();
        expect(prizeServiceMock.selectWinner).toHaveBeenCalledTimes(2);
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();

        expect(res).toEqual([
            {
                raffleId: 1,
                winnersAssigned: 2,
            },
        ]);
    });

    it("revierte transacción si ocurre un error", async () => {
        mockRaffleRepo.find.mockResolvedValue([{ id: 1 }]);

        mockQueryRunner.manager.find.mockRejectedValue(new Error("DB fail"));

        await expect(closeExpiredRaffles(prizeServiceMock)).rejects.toThrow("DB fail");

        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
});