import { PrizesController } from '../../controllers/prizesController';
import { Request, Response } from 'express';

const mockService = {
    getWinners: jest.fn(),
    getAllPrizes: jest.fn(),
    createPrize: jest.fn(),
    getPrizeById: jest.fn(),
    deletePrize: jest.fn(),
    updatePrize: jest.fn(),
    selectWinner: jest.fn(),
    closeRaffle: jest.fn(),
};

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('PrizesController', () => {
    let controller: PrizesController;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new PrizesController(mockService as any);
    });

    it('getAllPrizes → debe retornar lista de premios', async () => {
        const req = {} as Request;
        const res = mockResponse();

        mockService.getAllPrizes.mockResolvedValue([{ id: 1 }]);

        await controller.getAllPrizes(req, res);

        expect(mockService.getAllPrizes).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
    it('createPrize → debe crear un premio', async () => {
        const req = { body: { name: 'Premio X' } } as Request;
        const res = mockResponse();

        const responseMock = { message: 'ok', data: { id: 10 } };
        mockService.createPrize.mockResolvedValue(responseMock);

        await controller.createPrize(req, res);

        expect(mockService.createPrize).toHaveBeenCalledWith({ name: 'Premio X' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(responseMock);
    });

    it('getPrizeById → debe retornar un premio', async () => {
        const req = { params: { id: '5' } } as any;
        const res = mockResponse();

        mockService.getPrizeById.mockResolvedValue({ id: 5 });

        await controller.getPrizeById(req, res);

        expect(mockService.getPrizeById).toHaveBeenCalledWith(5);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 5 });
    });

    it('getPrizeById → debe retornar 404 si no existe', async () => {
        const req = { params: { id: '99' } } as any;
        const res = mockResponse();

        mockService.getPrizeById.mockResolvedValue(null);

        await controller.getPrizeById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No se encontró el premio' });
    });

    it('deletePrize → debe eliminar un premio', async () => {
        const req = { params: { id: '3' } } as any;
        const res = mockResponse();

        mockService.deletePrize.mockResolvedValue({ message: 'ok' });

        await controller.deletePrize(req, res);

        expect(mockService.deletePrize).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Premio eliminado' });
    });

    it('updatePrize → debe actualizar un premio', async () => {
        const req = {
            params: { id: '7' },
            body: { name: 'Nuevo nombre' },
        } as any;

        const res = mockResponse();

        const responseMock = { message: 'ok', data: { id: 7 } };
        mockService.updatePrize.mockResolvedValue(responseMock);

        await controller.updatePrize(req, res);

        expect(mockService.updatePrize).toHaveBeenCalledWith(7, { name: 'Nuevo nombre' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(responseMock);
    });

    it('selectWinner → debe seleccionar ganador', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockResponse();

        const mockWinner = { prizeId: 1, winnerTicket: { id_ticket: 10 } };
        mockService.selectWinner.mockResolvedValue(mockWinner);

        await controller.selectWinner(req, res);

        expect(mockService.selectWinner).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockWinner);
    });

    it('closeRaffle → debe cerrar la rifa y enviar ganadores', async () => {
        const req = { params: { raffleId: '8' } } as any;
        const res = mockResponse();

        const mockResult = {
            message: 'Rifa cerrada y ganadores seleccionados',
            winners: [{ prizeId: 1 }],
        };

        mockService.closeRaffle.mockResolvedValue(mockResult);

        await controller.closeRaffle(req, res);

        expect(mockService.closeRaffle).toHaveBeenCalledWith(8);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });
});
