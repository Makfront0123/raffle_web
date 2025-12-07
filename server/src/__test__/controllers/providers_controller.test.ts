
import { Request, Response } from 'express';
import { ProviderController } from '../../controllers/providersController';

const mockService = {
    getAllProviders: jest.fn(),
    createProvider: jest.fn(),
    deleteProvider: jest.fn(),
    getProviderById: jest.fn(),
    updateProvider: jest.fn(),
};

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('ProviderController', () => {
    let controller: ProviderController;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new ProviderController(mockService as any);
    });

    // ------------------------------------------------------
    // getAll
    // ------------------------------------------------------
    it('getAll → debe retornar lista de proveedores', async () => {
        const req = {} as Request;
        const res = mockResponse();

        mockService.getAllProviders.mockResolvedValue([{ id: 1 }]);

        await controller.getAll(req, res);

        expect(mockService.getAllProviders).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('create → debe crear un proveedor', async () => {
        const req = { body: { name: 'Proveedor X' } } as Request;
        const res = mockResponse();

        mockService.createProvider.mockResolvedValue({ id: 10, name: 'Proveedor X' });

        await controller.create(req, res);

        expect(mockService.createProvider).toHaveBeenCalledWith({ name: 'Proveedor X' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 10, name: 'Proveedor X' });
    });

    it('delete → debe eliminar proveedor', async () => {
        const req = { params: { id: '3' } } as any;
        const res = mockResponse();

        mockService.deleteProvider.mockResolvedValue(undefined);

        await controller.delete(req, res);

        expect(mockService.deleteProvider).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Proveedor eliminado correctamente'
        });
    });

    it('getById → debe retornar proveedor', async () => {
        const req = { params: { id: '5' } } as any;
        const res = mockResponse();

        mockService.getProviderById.mockResolvedValue({ id: 5 });

        await controller.getById(req, res);

        expect(mockService.getProviderById).toHaveBeenCalledWith(5);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 5 });
    });

    it('getById → debe retornar 404 si no existe', async () => {
        const req = { params: { id: '9' } } as any;
        const res = mockResponse();

        mockService.getProviderById.mockResolvedValue(null);

        await controller.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No se encontró el proveedor'
        });
    });

    it('update → debe actualizar proveedor', async () => {
        const req = { params: { id: '4' }, body: { name: 'Nuevo nombre' } } as any;
        const res = mockResponse();

        const mockResult = { id: 4, name: 'Nuevo nombre' };
        mockService.updateProvider.mockResolvedValue(mockResult);

        await controller.update(req, res);

        expect(mockService.updateProvider).toHaveBeenCalledWith(4, { name: 'Nuevo nombre' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });
});
