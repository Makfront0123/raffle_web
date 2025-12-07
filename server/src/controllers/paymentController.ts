import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';

export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await this.paymentService.getAllPayments();
            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo pagos', error });
        }
    }

    async createPayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;

            const payment = await this.paymentService.createPayment({
                ...req.body,
                user_id: userId,
            });

            res.status(201).json(payment);
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({
                message: 'Error creando pago',
                error: error.message || error
            });
        }
    }

    async getPaymentById(req: Request, res: Response) {
        try {
            const payment = await this.paymentService.getPaymentById(Number(req.params.id));
            if (!payment) return res.status(404).json({ message: 'No se encontró el pago' });
            res.status(200).json(payment);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo pago', error });
        }
    }

    async deletePayment(req: Request, res: Response) {
        try {
            await this.paymentService.deletePayment(Number(req.params.id));
            res.status(200).json({ message: 'Pago eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error eliminando pago', error });
        }
    }

    async updatePayment(req: Request, res: Response) {
        try {
            const payment = await this.paymentService.updatePayment(
                Number(req.params.id),
                req.body
            );
            res.status(200).json(payment);
        } catch (error) {
            res.status(500).json({ message: 'Error actualizando pago', error });
        }
    }

    async completePayment(req: Request, res: Response) {
        try {
            const paymentId = Number(req.params.id);
            const result = await this.paymentService.completePayment(paymentId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al completar el pago', error });
        }
    }

    async cancelPayment(req: Request, res: Response) {
        try {
            const paymentId = Number(req.params.id);
            const result = await this.paymentService.cancelPayment(paymentId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al cancelar el pago', error });
        }
    }
}
