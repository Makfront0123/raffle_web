import { RaffleController } from "../../controllers/raffleController";
import { RaffleService } from "../../services/raffleService";

jest.mock("../../services/raffleService");

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("RaffleController", () => {
    let controller: RaffleController;
    let mockService: jest.Mocked<RaffleService>;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new RaffleController();
        mockService = RaffleService.prototype as jest.Mocked<RaffleService>;
    });

    it("debe obtener todas las rifas", async () => {
        const req = {} as any;
        const res = mockResponse();

        mockService.getAllRaffles.mockResolvedValue([{ id: 1 }]);

        await controller.getAllRaffles(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("debe obtener rifa por ID", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        mockService.getRaffleById.mockResolvedValue({ id: 1 });

        await controller.getRaffleById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it("debe retornar 404 si no existe la rifa", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        mockService.getRaffleById.mockResolvedValue(null);

        await controller.getRaffleById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No se encontró la rifa" });
    });

    it("debe crear una rifa", async () => {
        const req = {
            body: {
                title: "Rifa Test",
                description: "desc",
                price: 100,
                endDate: "2025-01-01",
                digits: 3,
                type: "normal"
            }
        } as any;

        const res = mockResponse();

        const mockResult = {
            message: "Rifa creada",
            raffle: { id: 1 },
            totalTickets: 100
        };

        mockService.createRaffle.mockResolvedValue(mockResult);

        await controller.createRaffle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("debe eliminar una rifa existente", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        mockService.getRaffleById.mockResolvedValue({ id: 1 });
        mockService.deleteRaffle.mockResolvedValue({ message: "ok" });

        await controller.deleteRaffle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "ok" });
    });

    it("debe retornar 404 al intentar eliminar rifa inexistente", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        mockService.getRaffleById.mockResolvedValue(null);

        await controller.deleteRaffle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No se encontró la rifa" });
    });

    it("debe actualizar una rifa", async () => {
        const req = {
            params: { id: "1" },
            body: {
                title: "Nuevo titulo",
                description: "d",
                price: 500,
                endDate: "2025-01-01"
            }
        } as any;

        const res = mockResponse();

        const mockResult = {
            message: "Rifa actualizada",
            raffle: { id: 1 }
        };

        mockService.updateRaffle.mockResolvedValue(mockResult);

        await controller.updateRaffle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("debe regenerar tickets", async () => {
        const req = { params: { raffleId: "1", digits: "4" } } as any;
        const res = mockResponse();

        const mockResult = {
            message: "Tickets regenerados",
            total: 100
        };

        mockService.regenerateTickets.mockResolvedValue(mockResult);

        await controller.regenerateTickets(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("debe activar la rifa", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        const mockResult = {
            message: "Rifa activada correctamente",
            raffle: { id: 1, active: true }
        };

        mockService.activateRaffle.mockResolvedValue(mockResult);

        await controller.activateRaffle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });
    
    it("debe desactivar la rifa", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        const mockResult = {
            message: "Rifa desactivada correctamente",
            raffle: { id: 1, active: false }
        };

        mockService.deactivateRaffle.mockResolvedValue(mockResult);

        await controller.deactivateRaffle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });
});
