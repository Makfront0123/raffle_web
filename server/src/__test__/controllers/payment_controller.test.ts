import { Request, Response } from "express";
import { PaymentController } from "../../controllers/paymentController";
import { PaymentService } from "../../services/paymentService";

jest.mock("../../services/paymentService");

describe("PaymentController", () => {
    let controller: PaymentController;
    let mockService: jest.Mocked<PaymentService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        const MockedService = PaymentService as jest.MockedClass<typeof PaymentService>;
        mockService = new MockedService() as jest.Mocked<PaymentService>;

        controller = new PaymentController(mockService);

        req = {
            params: {},
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("getAllPayments devuelve lista de pagos", async () => {
        mockService.getAllPayments.mockResolvedValue([{ id: 1 }] as any);

        await controller.getAllPayments(req as Request, res as Response);

        expect(mockService.getAllPayments).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    test("createPayment usa user.id y crea pago", async () => {
        req.body = { amount: 100 };
        (req as any).user = { id: 99 };

        mockService.createPayment.mockResolvedValue({ id: 1, user_id: 99 } as any);

        await controller.createPayment(req as Request, res as Response);

        expect(mockService.createPayment).toHaveBeenCalledWith({
            amount: 100,
            user_id: 99,
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, user_id: 99 });
    });

    test("getPaymentById devuelve 404 si no existe", async () => {
        req.params = { id: "10" };
        mockService.getPaymentById.mockResolvedValue(null);

        await controller.getPaymentById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No se encontró el pago" });
    });

    test("getPaymentById devuelve el pago", async () => {
        req.params = { id: "10" };
        mockService.getPaymentById.mockResolvedValue({ id: 10 } as any);

        await controller.getPaymentById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 10 });
    });

    test("deletePayment elimina correctamente", async () => {
        req.params = { id: "7" };

        mockService.deletePayment.mockResolvedValue(undefined);

        await controller.deletePayment(req as Request, res as Response);

        expect(mockService.deletePayment).toHaveBeenCalledWith(7);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Pago eliminado" });
    });

    test("updatePayment actualiza correctamente", async () => {
        req.params = { id: "5" };
        req.body = { status: "paid" };

        mockService.updatePayment.mockResolvedValue({ id: 5, status: "paid" } as any);

        await controller.updatePayment(req as Request, res as Response);

        expect(mockService.updatePayment).toHaveBeenCalledWith(5, { status: "paid" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 5, status: "paid" });
    });

    test("completePayment funciona", async () => {
        req.params = { id: "3" };
        mockService.completePayment.mockResolvedValue({ success: true } as any);

        await controller.completePayment(req as Request, res as Response);

        expect(mockService.completePayment).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test("cancelPayment funciona", async () => {
        req.params = { id: "3" };
        mockService.cancelPayment.mockResolvedValue({ success: true } as any);

        await controller.cancelPayment(req as Request, res as Response);

        expect(mockService.cancelPayment).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
});
