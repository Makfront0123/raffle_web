import { ReservationService } from "../../services/reservationService";
import { Reservation } from "../../entities/reservation.entity";
import { ReservationTicket } from "../../entities/reservation_ticket.entity";
import { Ticket } from "../../entities/ticket.entity";
import { Raffle } from "../../entities/raffle.entity";

let mockReservationRepo: any;
let mockTicketRepo: any;
let mockRaffleRepo: any;

let mockQueryRunner: any;
let mockDataSource: any;
let service: ReservationService;

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

        mockQueryRunner.manager.find.mockResolvedValue(tickets);

        mockQueryRunner.manager.save.mockImplementation(async (obj: any) => obj);

        const result = await service.createReservation(99, 1, [10, 11]);

        expect(result.message).toBe("Tickets reservados exitosamente");
        expect(mockQueryRunner.manager.create).toHaveBeenCalled();
        expect(mockQueryRunner.manager.save).toHaveBeenCalled();
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    test("createReservation falla si un ticket no pertenece a la rifa", async () => {
        mockRaffleRepo.findOne.mockResolvedValue({ id: 1, status: "active" });

        const wrongTicket = {
            id_ticket: 77,
            status: "available",
            raffle: { id: 999 },
        };

        mockQueryRunner.manager.find.mockResolvedValue([wrongTicket]);

        await expect(
            service.createReservation(1, 1, [77])
        ).rejects.toThrow("Uno o más tickets no pertenecen a esta rifa.");

        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    test("deleteReservation elimina correctamente", async () => {
        const reservation = {
            id: 5,
            user: { id: 99 },
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

        mockQueryRunner.manager.find.mockResolvedValue(expiredReservations);

        const result = await service.releaseExpiredReservations();

        expect(result.message).toContain("liberadas");
        expect(mockQueryRunner.manager.save).toHaveBeenCalled();
        expect(mockQueryRunner.manager.remove).toHaveBeenCalled();
    });

});
