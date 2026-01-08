import { ReservationController } from "../../controllers/reservationController";
import { ReservationService } from "../../services/reservationService";

jest.mock("../../services/reservationService");

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("ReservationController", () => {
    let controller: ReservationController;
    let mockService: jest.Mocked<ReservationService>;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new ReservationController();
        mockService = ReservationService.prototype as jest.Mocked<ReservationService>;
    });

    it("debe obtener todas las reservas", async () => {
        const req = {} as any;
        const res = mockResponse();

        mockService.getAllReservations.mockResolvedValue([{ id: 1 }]);

        await controller.getAllReservations(req, res);

        expect(mockService.getAllReservations).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("debe obtener una reserva por ID", async () => {
        const req = { params: { id: "5" } } as any;
        const res = mockResponse();

        mockService.getReservationById.mockResolvedValue({ id: 5 });

        await controller.getReservationById(req, res);

        expect(mockService.getReservationById).toHaveBeenCalledWith(5);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 5 });
    });

    it("debe devolver 404 si no existe la reserva", async () => {
        const req = { params: { id: "5" } } as any;
        const res = mockResponse();

        mockService.getReservationById.mockResolvedValue(null);

        await controller.getReservationById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No se encontró la reserva" });
    });

    it("debe crear una reserva", async () => {
        const req = {
            user: { id: 10 },
            body: { raffleId: 2, ticketIds: [1, 2, 3] }
        } as any;

        const res = mockResponse();

        mockService.createReservation.mockResolvedValue({
            reservation: { id: 99 },
            message: "Reserva creada correctamente",
        });

        await controller.createReservation(req, res);

        expect(mockService.createReservation).toHaveBeenCalledWith(10, 2, [1, 2, 3]);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 99,
            raffleId: 2,
            userId: 10,
            tickets: [1, 2, 3]
        });
    });

    it("debe retornar 401 si no hay usuario autenticado", async () => {
        const req = { body: { raffleId: 1, ticketIds: [] } } as any;
        const res = mockResponse();

        await controller.createReservation(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuario no autenticado" });
    });

    it("debe eliminar una reserva", async () => {
        const req = {
            params: { id: "7" },
            user: { id: 99 }
        } as any;

        const res = mockResponse();

        mockService.deleteReservation.mockResolvedValue({
            message: "Reserva eliminada correctamente",
            reservation: { id: 7 },
        });

        await controller.deleteReservation(req, res);

        expect(mockService.deleteReservation).toHaveBeenCalledWith(7, 99);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 7 });
    });

    it("debe liberar reservas expiradas", async () => {
        const req = {} as any;
        const res = mockResponse();

        mockService.releaseExpiredReservations.mockResolvedValue({
            message: "Reservas liberadas correctamente",
        });

        await controller.releaseExpiredReservations(req, res);

        expect(mockService.releaseExpiredReservations).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ released: 12 });
    });
    it("debe obtener reservas por usuario", async () => {
        const req = { user: { id: 10 } } as any;
        const res = mockResponse();

        mockService.getAllReservationsByUser.mockResolvedValue([
            { id: 1, userId: 10 }
        ]);

        await controller.getAllReservationsByUser(req, res);

        expect(mockService.getAllReservationsByUser).toHaveBeenCalledWith(10);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, userId: 10 }]);
    });

    it("debe retornar 401 si el usuario no está autenticado en getAllReservationsByUser", async () => {
        const req = {} as any;
        const res = mockResponse();

        await controller.getAllReservationsByUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuario no autenticado" });
    });
});
