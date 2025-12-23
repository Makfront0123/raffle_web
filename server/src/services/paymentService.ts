import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Payment } from "../entities/payment.entity";
import { Ticket } from "../entities/ticket.entity";
import { User } from "../entities/user.entity";
import { Raffle } from "../entities/raffle.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import type { Request, Response } from "express";
import crypto from "crypto";

export class PaymentService {
  private ticketRepository;
  private paymentRepo;

  constructor(private dataSource = AppDataSource) {
    this.ticketRepository = dataSource.getRepository(Ticket);
    this.paymentRepo = dataSource.getRepository(Payment);
  }



  async getPaymentById(id: number) {
    return await this.paymentRepo.findOne({
      where: { id },
      relations: ["details", "user", "raffle"],
    });
  }

  async deletePayment(id: number) {
    await this.paymentRepo.delete({ id });
  }

  async updatePayment(id: number, payment: any) {
    const paymentEntity = await this.paymentRepo.findOne({ where: { id } });
    if (!paymentEntity) throw new Error("No se encontró el pago");

    Object.assign(paymentEntity, payment);
    await this.paymentRepo.save(paymentEntity);
    return paymentEntity;
  }

  async completePayment(paymentId: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["details", "details.ticket"],
    });

    if (!payment) throw new Error("Pago no encontrado");

    payment.status = "completed";
    await this.paymentRepo.save(payment);

    for (const d of payment.details) {
      d.ticket.status = "purchased";
      await this.ticketRepository.save(d.ticket);
    }
  }

  async cancelPayment(paymentId: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["details", "details.ticket"],
    });

    if (!payment) throw new Error("Pago no encontrado");

    payment.status = "cancelled";
    payment.cancelled_at = new Date();
    await this.paymentRepo.save(payment);

    for (const detail of payment.details) {
      detail.ticket.status = "available";
      detail.ticket.purchased_at = null;
      await this.ticketRepository.save(detail.ticket);
    }

    return {
      message: `Pago #${paymentId} cancelado correctamente. Tickets liberados.`,
    };
  }

  async getAllPayments() {
    return await this.paymentRepo.find({
      relations: ["user", "raffle"],
    });
  }

  async getPaymentUser(userId: number) {
    return await this.paymentRepo.find({
      where: { user: { id: userId } }, // ✅ filtramos por user.id
      relations: ["user", "raffle", "details", "details.ticket"], // traemos relaciones necesarias
    });
  }


  async createPayment(payment: any) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id: payment.user_id },
      });
      if (!user) throw new Error("No se encontró el usuario");

      const raffle = await manager.getRepository(Raffle).findOne({
        where: { id: payment.raffle_id },
      });
      if (!raffle) throw new Error("No se encontró la rifa");

      const tickets = await manager.getRepository(Ticket).find({
        where: { id_ticket: In(payment.ticket_ids) },
      });
      if (!tickets.length) throw new Error("No hay tickets seleccionados");

      for (const ticket of tickets) {
        if (ticket.status !== "available") {
          throw new Error(`El ticket ${ticket.id_ticket} no está disponible`);
        }
      }

      const totalAmount = tickets.length * Number(raffle.price);

      const paymentEntity = manager.getRepository(Payment).create({
        user,
        raffle,
        total_amount: totalAmount,
        status: "approved",
        method: payment.method || "manual",
        transaction_id: `TX-${Date.now()}`,
      });
      await manager.getRepository(Payment).save(paymentEntity);

      for (const ticket of tickets) {
        const detail = manager.getRepository(PaymentDetail).create({
          payment: paymentEntity,
          ticket,
          amount: Number(raffle.price),
        });
        await manager.getRepository(PaymentDetail).save(detail);

        ticket.status = "purchased";
        ticket.purchased_at = new Date();
        await manager.getRepository(Ticket).save(ticket);
      }

      return {
        message: "Pago registrado correctamente",
        payment_id: paymentEntity.id,
        total_amount: totalAmount,
      };
    });
  }

  async createWompiPayment({
    userId,
    ticketId,
    method,
    reference,
  }: {
    userId: number;
    ticketId: number;
    method: "card" | "pse";
    reference: string;
  }) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({ where: { id: userId } });
      if (!user) throw new Error("Usuario no encontrado");

      const ticket = await manager.getRepository(Ticket).findOne({
        where: { id_ticket: ticketId },
        relations: ["raffle"],
      });
      if (!ticket) throw new Error("Ticket no encontrado");

      if (ticket.status !== "available") {
        throw new Error("El ticket no está disponible");
      }

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const payment = manager.getRepository(Payment).create({
        user,
        raffle: ticket.raffle,
        total_amount: Number(ticket.raffle.price),
        status: "pending",
        method,
        reference,
        expires_at: expiresAt,
      });

      await manager.getRepository(Payment).save(payment);

      const detail = manager.getRepository(PaymentDetail).create({
        payment,
        ticket,
        amount: Number(ticket.raffle.price),
      });
      await manager.getRepository(PaymentDetail).save(detail);

      ticket.status = "held";
      ticket.held_until = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      await manager.getRepository(Ticket).save(ticket);

      return {
        payment_id: payment.id,
        reference,
        amount_in_cents: Number(ticket.raffle.price) * 100,
        currency: "COP",
      };
    });
  }


  async wompiWebhook(req: Request, res: Response) {
    const event = req.body;
    const checksum = req.headers["x-event-checksum"] as string;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    const isDev = process.env.NODE_ENV !== "production";
    if (!isDev) {
      if (!checksum || !integritySecret) {
        return res.status(400).json({ message: "Firma no encontrada" });
      }

      const generatedHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(event) + integritySecret)
        .digest("hex");

      if (generatedHash !== checksum) {
        return res.status(401).json({ message: "Firma inválida" });
      }
    }

    const tx = event?.data?.transaction;
    if (!tx?.reference || !tx?.status) {
      return res.status(400).json({ message: "Evento inválido" });
    }

    const payment = await this.paymentRepo.findOne({
      where: { reference: tx.reference },
      relations: ["details", "details.ticket"],
    });

    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    if (payment.status === "approved" || payment.status === "declined") {
      return res.status(200).json({ message: "Evento ya procesado" });
    }

    payment.transaction_id = tx.id;

    switch (tx.status) {
      case "APPROVED":
        payment.status = "completed";
        break;

      case "DECLINED":
        payment.status = "cancelled";
        break;

      case "ERROR":
        payment.status = "failed";
        break;

      default:
        payment.status = "pending";
    }

    await this.paymentRepo.save(payment);


    if (tx.status === "APPROVED") {
      for (const d of payment.details) {
        d.ticket.status = "purchased";
        d.ticket.purchased_at = new Date();
        await this.ticketRepository.save(d.ticket);
      }
    }

    if (tx.status === "DECLINED" || tx.status === "ERROR") {
      for (const d of payment.details) {
        d.ticket.status = "available";
        await this.ticketRepository.save(d.ticket);
      }
    }

    return res.status(200).json({ message: "Webhook procesado correctamente" });
  }
  async getWompiSignature(
    reference: string,
    amountInCents: number,
    currency: string
  ): Promise<string> {

    const privateKey = process.env.WOMPI_INTEGRITY_SECRET!;
    if (!privateKey) {
      throw new Error("Private key de Wompi no configurada");
    }

    const stringToSign = `${reference}${amountInCents}${currency}${privateKey}`;

    return crypto
      .createHash("sha256")
      .update(stringToSign)
      .digest("hex");
  }


}