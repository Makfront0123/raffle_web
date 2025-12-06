import axios from "axios";

import { Reservation } from "@/type/Reservation";
import { ReservationService } from "@/services/reservationService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
    };

    it("getAllReservations → retorna lista", async () => {
        mockedAxios.get.mockResolvedValue({ data: [reservationMock] });

        const res = await service.getAllReservations(token);

        expect(res).toEqual([reservationMock]);
    });

    it("getReservationById → retorna 1", async () => {
        mockedAxios.get.mockResolvedValue({ data: reservationMock });

        const res = await service.getReservationById(1, token);

        expect(res).toEqual(reservationMock);
    });

    it("createReservation → retorna creada", async () => {
        mockedAxios.post.mockResolvedValue({ data: reservationMock });

        const res = await service.createReservation(5, 1, token);

        expect(res).toEqual(reservationMock);
    });

    it("cancelReservation → retorna mensaje + reserva", async () => {
        mockedAxios.delete.mockResolvedValue({
            data: { message: "Cancelada", reservation: reservationMock },
        });

        const res = await service.cancelReservation(1, token);

        expect(res.message).toBe("Cancelada");
        expect(res.reservation).toEqual(reservationMock);
    });

    it("getAllReservationsByUser → retorna lista", async () => {
        mockedAxios.get.mockResolvedValue({ data: [reservationMock] });

        const res = await service.getAllReservationsByUser(token);

        expect(res).toEqual([reservationMock]);
    });
});
