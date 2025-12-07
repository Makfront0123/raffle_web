
import { AppDataSource } from "../../data-source";
import { LessThanOrEqual } from "typeorm";
import { Reservation } from "../../entities/reservation.entity";
import { Ticket } from "../../entities/ticket.entity";
import { Prize } from "../../entities/prize.entity";
import { PrizesService } from "../../services/prizesService";
import { cleanupExpiredReservations, closeExpiredRaffles } from "../../cron/raffleCronLogic";

// ===============================
// 🧪 Mock globales
// ===============================
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

const mockReservationRepo = {
    find: jest.fn(),
    remove: jest.fn(),
};
const mockTicketRepo = {
    createQueryBuilder: jest.fn().mockReturnValue({
        update: () => ({
            set: () => ({
                whereInIds: () => ({
                    execute: jest.fn(),
                }),
            }),
        }),
    }),
};

const mockRaffleRepo = {
    find: jest.fn(),
};

// Mock QueryRunner
const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
        save: jest.fn(),
        find: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
            update: () => ({
                set: () => ({
                    where: () => ({
                        execute: jest.fn(),
                    }),
                }),
            }),
            delete: () => ({
                from: () => ({
                    where: () => ({
                        execute: jest.fn(),
                    }),
                }),
            }),
        }),
    },
};

// Asignar mocks a AppDataSource
(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
    if (entity === Reservation) return mockReservationRepo;
    if (entity === Ticket) return mockTicketRepo;
    if (entity === Prize) return mockRaffleRepo;
    return mockRaffleRepo;
});

(AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(mockQueryRunner);

const prizeServiceMock = new (PrizesService as any)();

beforeEach(() => {
    jest.clearAllMocks();
});

// ======================================================================
// 1️⃣ TEST: cleanupExpiredReservations
// ======================================================================
describe("cleanupExpiredReservations", () => {
    it("libera tickets y elimina reservas expiradas", async () => {
        mockReservationRepo.find.mockResolvedValue([
            {
                id: 10,
                reservationTickets: [
                    { ticket: { id_ticket: 1 } },
                    { ticket: { id_ticket: 2 } },
                ],
            },
        ]);

        mockReservationRepo.remove.mockResolvedValue(true);

        const result = await cleanupExpiredReservations();

        expect(result).toBe(1);
        expect(mockReservationRepo.find).toHaveBeenCalled();
        expect(mockReservationRepo.remove).toHaveBeenCalledTimes(1);
    });
});

// ======================================================================
// 2️⃣ TEST: closeExpiredRaffles
// ======================================================================
describe("closeExpiredRaffles", () => {
    it("cierra rifas expiradas y asigna ganadores", async () => {
        // 1 → la rifa encontrada
        mockRaffleRepo.find.mockResolvedValue([
            { id: 1, status: "active", tickets: [] },
        ]);

        // 2 → premios del queryRunner
        mockQueryRunner.manager.find.mockResolvedValue([
            { id: 50, name: "Premio 1" },
            { id: 51, name: "Premio 2" },
        ]);

        // 3 → selectWinner mocked
        prizeServiceMock.selectWinner.mockResolvedValue(true);

        const res = await closeExpiredRaffles(prizeServiceMock);


        expect(mockRaffleRepo.find).toHaveBeenCalled();
        expect(prizeServiceMock.selectWinner).toHaveBeenCalledTimes(2);

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

        await expect(closeExpiredRaffles()).rejects.toThrow("DB fail");

        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
});
