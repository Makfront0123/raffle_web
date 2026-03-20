import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { Raffle } from '../entities/raffle.entity';


export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await this.paymentService.getAllPayments();
            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo pagos', error });
        }
    }
    async sendWhatsappReceiptController(req: Request, res: Response) {
        try {
            const { phone, raffleId, tickets, amount, reference } = req.body;

            const result = await this.paymentService.sendReceiptWithValidation({
                phone,
                raffleId,
                tickets,
                amount,
                reference,
            });

            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    async getPaymentUser(req: Request, res: Response) {
        try {
            const payments = await this.paymentService.getPaymentUser((req as any).user.id);
            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo pagos', error });
        }
    }
    async sendWhatsappReceipt(req: Request, res: Response) {
        try {
            const { phone, raffleId, tickets, amount } = req.body;

            if (!phone || !raffleId || !Array.isArray(tickets) || tickets.length === 0 || !amount) {
                return res.status(400).json({ message: "Datos incompletos" });
            }

            const raffle = await this.paymentService.getRaffleById(raffleId);

            if (!raffle) return res.status(404).json({ message: "Rifa no encontrada" });

            await this.paymentService.sendWhatsappReceipt({
                phone,
                raffle,
                tickets,
                amount,
            });

            return res.status(200).json({ message: "Recibo enviado por WhatsApp" });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                message: "Error enviando recibo",
                error: error.message,
            });
        }
    }





    async createPayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;

            const { raffle_id, ticket_ids, reference, reservation_id } = req.body;

            if (
                !raffle_id ||
                !ticket_ids ||
                !Array.isArray(ticket_ids) ||
                ticket_ids.length === 0 ||
                !reference
            ) {
                return res.status(400).json({ message: "Datos incompletos o inválidos" });
            }

            const payment = await this.paymentService.createPayment({
                raffle_id,
                ticket_ids,
                reservation_id,
                reference,
                user_id: userId,
            });

            res.status(201).json(payment);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                message: "Error creando pago",
                error: error.message || error,
            });
        }
    }

    async cancelPaymentByReference(req: Request, res: Response) {
        try {
            const { reference } = req.params;

            const result = await this.paymentService.cancelPaymentByReference(reference);

            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message,
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

    async getPaymentLogs(req: Request, res: Response) {
        try {
            const paymentId = Number(req.params.id);
            const result = await this.paymentService.getPaymentLogs(paymentId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo logs', error });
        }
    }

    async createWompiPayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id ?? req.body.userId;
            if (!userId) {
                return res.status(400).json({ message: "User ID requerido" });
            }

            const { raffle_id, ticket_ids, method, reference, reservation_id } = req.body;

            if (!raffle_id || !ticket_ids?.length || !reference) {
                return res.status(400).json({ message: "Datos incompletos o inválidos" });
            }

            const wompiResult = await this.paymentService.createWompiPayment({
                userId,
                raffle_id,
                ticket_ids,
                reservation_id,
                reference,
            });

            return res.status(201).json(wompiResult);

        } catch (error: any) {
            console.error(error);
            return res.status(400).json({
                message: error.message || "Error creando pago Wompi",
            });
        }
    }


    async wompiWebhook(req: Request, res: Response) {
        console.log("🔥 WOMPÍ WEBHOOK RECIBIDO");
        const rawBody = Buffer.isBuffer(req.body)
            ? req.body.toString("utf8")
            : JSON.stringify(req.body);

        console.log("Raw body:", rawBody);

        let event;
        try {
            event = JSON.parse(rawBody);
        } catch {
            return res.status(400).json({ message: "JSON inválido" });
        }

        return this.paymentService.handleWompiWebhook(
            event,
            rawBody,
            req.headers,
            res
        );
    }



    async getWompiSignature(req: Request, res: Response) {
        try {
            const { reference, amount_in_cents, currency } = req.body;

            if (!reference || !amount_in_cents || !currency) {
                return res.status(400).json({ message: "Datos incompletos" });
            }

            const signature = await this.paymentService.getWompiSignature(
                reference,
                amount_in_cents,
                currency
            );

            return res.json({ signature });

        } catch (error: any) {
            return res.status(500).json({
                message: "Error generando firma",
                error: error.message,
            });
        }
    }
    async getPaymentStatusByReference(req: Request, res: Response) {
        try {
            const { reference } = req.params;

            const payment = await this.paymentService.getPaymentByReference(reference);

            if (!payment) {
                return res.status(404).json({ status: "NOT_FOUND" });
            }

            return res.status(200).json({
                status: payment.status,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error obteniendo estado" });
        }
    }

}