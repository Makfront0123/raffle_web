import { TicketController } from "../../controllers/ticketController";

describe("TicketController", () => {
    let controller: TicketController;
    let mockService: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockService = {
            getSoldPercentage: jest.fn(),
            getTicketsByUser: jest.fn(),
        };

        controller = new TicketController(mockService);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("debe obtener el porcentaje vendido", async () => {
        req = { params: { raffleId: "7" } };

        const mockResult = {
            raffleId: 7,
            totalTickets: 100,
            soldTickets: 42,
            reservedTickets: 10,
            availableTickets: 48,
            soldPercentage: 42,
        };

        mockService.getSoldPercentage.mockResolvedValue(mockResult);

        await controller.getSoldPercentage(req, res);

        expect(mockService.getSoldPercentage).toHaveBeenCalledWith(7);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });
});
