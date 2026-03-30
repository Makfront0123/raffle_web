import { ReservationService } from "../../services/reservationService";
import { Reservation } from "../../entities/reservation.entity";
import { Ticket } from "../../entities/ticket.entity";
import { Raffle } from "../../entities/raffle.entity";

let mockReservationRepo: any;
let mockTicketRepo: any;
let mockRaffleRepo: any;

let mockQueryRunner: any;
let mockDataSource: any;
let service: ReservationService;

let mockQueryBuilder: any;

beforeEach(() => {

    mockReservationRepo = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    mockTicketRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
    };

    mockRaffleRepo = {
        findOne: jest.fn(),
    };

    // 🔥 MOCK DEL QUERY BUILDER
    mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        setLock: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
    };

    mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),

        manager: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn((entity, data) => data),
            save: jest.fn(async (obj) => obj),
            remove: jest.fn(),
            update: jest.fn(), // 👈 IMPORTANTE
            createQueryBuilder: jest.fn(() => mockQueryBuilder), // 👈 🔥 CLAVE
        },
    };

    mockDataSource = {
        getRepository: jest.fn((entity) => {
            if (entity === Reservation) return mockReservationRepo;
            if (entity === Ticket) return mockTicketRepo;
            if (entity === Raffle) return mockRaffleRepo;
        }),
        createQueryRunner: jest.fn(() => mockQueryRunner),
    };

    service = new ReservationService(mockDataSource as any);
});

describe("ReservationService SIN BD", () => {
    test("createReservation crea correctamente", async () => {
        const raffle = { id: 1, status: "active" };

        mockRaffleRepo.findOne.mockResolvedValue(raffle);

        const tickets = [
            { id_ticket: 10, status: "available", raffle },
            { id_ticket: 11, status: "available", raffle },
        ];

        // 🔥 1ra llamada → tickets
        // 🔥 2da llamada → existingReservations
        mockQueryBuilder.getMany
            .mockResolvedValueOnce(tickets)
            .mockResolvedValueOnce([]);

        const result = await service.createReservation(99, 1, [10, 11]);

        expect(result.message).toBe("Tickets reservados exitosamente");
        expect(mockQueryRunner.manager.create).toHaveBeenCalled();
        expect(mockQueryRunner.manager.save).toHaveBeenCalled();
        expect(mockQueryRunner.manager.update).toHaveBeenCalled();
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    test("createReservation falla si un ticket no pertenece a la rifa", async () => {
        mockRaffleRepo.findOne.mockResolvedValue({ id: 1, status: "active" });

        const wrongTicket = {
            id_ticket: 77,
            status: "available",
            raffle: { id: 999 },
        };

        mockQueryBuilder.getMany
            .mockResolvedValueOnce([wrongTicket]) // tickets
            .mockResolvedValueOnce([]); // existingReservations

        await expect(
            service.createReservation(1, 1, [77])
        ).rejects.toThrow("Uno o más tickets no pertenecen a esta rifa.");

        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    test("deleteReservation elimina correctamente", async () => {
        const reservation = {
            id: 5,
            user: { id: 99 },
            expires_at: new Date(Date.now() + 60000),
            reservationTickets: [
                { ticket: { status: "reserved" } },
            ],
        };

        mockQueryRunner.manager.findOne.mockResolvedValue(reservation);

        const result = await service.deleteReservation(5, 99);

        expect(result.message).toBe("Reserva eliminada correctamente");
        expect(mockQueryRunner.manager.save).toHaveBeenCalled();
        expect(mockQueryRunner.manager.remove).toHaveBeenCalled();
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });


    test("releaseExpiredReservations libera correctamente", async () => {
        const expiredReservations = [
            {
                id: 10,
                expires_at: new Date(Date.now() - 60000),
                reservationTickets: [
                    { ticket: { status: "reserved" } },
                ],
            },
        ];

        mockQueryBuilder.getMany.mockResolvedValue(expiredReservations);

        const result = await service.releaseExpiredReservations();

        expect(result.message).toContain("liberadas");
        expect(mockQueryRunner.manager.save).toHaveBeenCalled();
        expect(mockQueryRunner.manager.remove).toHaveBeenCalled();
    });
});
