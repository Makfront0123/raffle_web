import { Reservation } from "@/type/Reservation";
import { ReservationService } from "@/services/reservationService";
import { api } from "@/api/api";

jest.mock("@/api/api", () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("ReservationService tests", () => {
    const service = new ReservationService();
    const token = "xyz";

    const reservationMock: Reservation = {
        id: 1,
        raffleId: 1,
        reservationTickets: [],
        userId: 10,
        created_at: "2024-01-01",
        expires_at: "2024-01-01",
        raffle: {
            id: 1,
            title: "Test",
            description: "Test",
            price: 10,
            end_date: "2024-01-01",
            digits: 2,
            total_numbers: 10,
            status: "active",
            prizes: [],
            tickets: [],
            created_at: "2024-01-01",
        },
    };

    it("getAllReservations → retorna lista", async () => {
        mockedApi.get.mockResolvedValue({ data: [reservationMock] });

        const res = await service.getAllReservations();

        expect(res).toEqual([reservationMock]);
    });

    it("getReservationById → retorna 1", async () => {
        mockedApi.get.mockResolvedValue({ data: reservationMock });

        const res = await service.getReservationById(1,);

        expect(res).toEqual(reservationMock);
    });

    it("createReservation → retorna creada", async () => {
        mockedApi.post.mockResolvedValue({ data: reservationMock });

        const res = await service.createReservation(5, 1,);

        expect(res).toEqual(reservationMock);
    });

    it("cancelReservation → retorna mensaje + reserva", async () => {
        mockedApi.delete.mockResolvedValue({
            data: { message: "Cancelada", reservation: reservationMock },
        });

        const res = await service.cancelReservation(1);

        expect(res.message).toBe("Cancelada");
        expect(res.reservation).toEqual(reservationMock);
    });

    it("getAllReservationsByUser → retorna lista", async () => {
        mockedApi.get.mockResolvedValue({ data: [reservationMock] });

        const res = await service.getAllReservationsByUser();

        expect(res).toEqual([reservationMock]);
    });
});
