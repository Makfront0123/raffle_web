import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { User } from "../entities/user.entity";
import { Raffle } from "../entities/raffle.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import type { Request, Response } from "express";
import crypto from "crypto";
import { WhatsappService } from "../services/whatpsappService";
import { Reservation } from "../entities/reservation.entity";

export class PaymentService {
  private ticketRepository;
  private paymentRepo;
  private whatsappService;

  constructor(private dataSource = AppDataSource) {
    this.ticketRepository = dataSource.getRepository(Ticket);
    this.paymentRepo = dataSource.getRepository(Payment);
    this.whatsappService = new WhatsappService();
  }

  async sendWhatsappReceipt({
    phone,
    raffleName,
    tickets,
    amount,
  }: {
    phone: string;
    raffleName: string;
    tickets: string[]; // ✅
    amount: number;
  }) {
    await this.whatsappService.sendReceipt({
      phone,
      raffleName,
      tickets,
      amount,
    });
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

    payment.status = PaymentStatus.COMPLETED;
    await this.paymentRepo.save(payment);

    for (const d of payment.details) {
      d.ticket.status = TicketStatus.PURCHASED;
      await this.ticketRepository.save(d.ticket);
    }
  }

  async cancelPayment(paymentId: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["details", "details.ticket"],
    });

    if (!payment) throw new Error("Pago no encontrado");

    payment.status = PaymentStatus.CANCELLED;
    payment.cancelled_at = new Date();
    await this.paymentRepo.save(payment);

    for (const detail of payment.details) {
      detail.ticket.status = TicketStatus.AVAILABLE;
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
      where: { user: { id: userId } },
      relations: ["user", "raffle", "details", "details.ticket"],
    });
  }
  async createPayment(payment: {
    raffle_id: number;
    ticket_ids: number[];
    reservation_id?: number;
    user_id: number;
    reference: string;
  }) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id: payment.user_id },
      });
      if (!user) throw new Error("No se encontró el usuario");

      const raffle = await manager.getRepository(Raffle).findOne({
        where: { id: payment.raffle_id },
      });
      if (!raffle) throw new Error("No se encontró la rifa");

      let tickets: Ticket[] = [];
      let reservation: Reservation | null = null;

      if (payment.reservation_id) {
        reservation = await manager.getRepository(Reservation).findOne({
          where: { id: payment.reservation_id },
          relations: [
            "user",
            "raffle",
            "reservationTickets",
            "reservationTickets.ticket",
          ],
        });

        if (!reservation) {
          throw new Error("No se encontró la reserva");
        }

        if (reservation.user.id !== payment.user_id) {
          throw new Error("La reserva no pertenece al usuario");
        }

        tickets = reservation.reservationTickets
          .map((rt) => rt.ticket)
          .filter((t) => payment.ticket_ids.includes(t.id_ticket));

        if (!tickets.length) {
          throw new Error("No hay tickets válidos en la reserva");
        }

        for (const ticket of tickets) {
          const belongsToReservation = reservation.reservationTickets.some(
            (rt) => rt.ticket.id_ticket === ticket.id_ticket
          );

          if (!belongsToReservation) {
            throw new Error(
              `El ticket ${ticket.id_ticket} no pertenece a esta reserva`
            );
          }

          if (ticket.status === "available") {
            throw new Error(`El ticket ${ticket.id_ticket} no pertenece a esta reserva`);
          }

          if (ticket.status === TicketStatus.PURCHASED) {
            throw new Error(`El ticket ${ticket.id_ticket} ya fue comprado`);
          }

          if (
            ticket.status === "held" &&
            ticket.held_until &&
            ticket.held_until < new Date()
          ) {
            throw new Error(`El ticket ${ticket.id_ticket} tiene el hold expirado`);
          }

        }
      }

      else {
        tickets = await manager.getRepository(Ticket).find({
          where: { id_ticket: In(payment.ticket_ids) },
          relations: ["raffle"],
        });

        if (!tickets.length) {
          throw new Error("No hay tickets seleccionados");
        }

        for (const ticket of tickets) {
          if (ticket.status !== TicketStatus.AVAILABLE) {
            throw new Error(
              `El ticket ${ticket.id_ticket} no está disponible`
            );
          }
        }
      }
      const totalAmount = tickets.length * Number(raffle.price);

      const paymentEntity = manager.getRepository(Payment).create({
        user,
        raffle,
        total_amount: totalAmount,
        status: PaymentStatus.COMPLETED,
        transaction_id: `TX-${Date.now()}`,
        reference: payment.reference,
      });

      await manager.getRepository(Payment).save(paymentEntity);
      for (const ticket of tickets) {
        const detail = manager.getRepository(PaymentDetail).create({
          payment: paymentEntity,
          ticket,
          amount: Number(raffle.price),
        });

        await manager.getRepository(PaymentDetail).save(detail);

        ticket.status = TicketStatus.PURCHASED;
        ticket.purchased_at = new Date();
        ticket.held_until = null;

        await manager.getRepository(Ticket).save(ticket);
      }

      if (reservation) {
        await manager.getRepository(Reservation).delete(reservation.id);
      }

      const responseTickets = tickets.map((t) => ({
        id: t.id_ticket,
        number: t.ticket_number,
        status: t.status,
      }));

      return {
        message: "Pago registrado correctamente",
        payment_id: paymentEntity.id,
        total_amount: totalAmount,
        tickets: responseTickets,
      };

    });
  }


  async createWompiPayment({
    userId,
    raffle_id,
    ticket_ids,
    reservation_id,
    reference,
  }: {
    userId: number;
    raffle_id: number;
    ticket_ids: number[];
    reservation_id?: number;
    reference: string;
  }) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) throw new Error("Usuario no encontrado");

      const raffle = await manager.getRepository(Raffle).findOne({
        where: { id: raffle_id },
      });
      if (!raffle) throw new Error("Rifa no encontrada");

      const heldTickets = await manager.getRepository(Ticket).find({
        where: {
          id_ticket: In(ticket_ids),
          status: In(["held", "reserved"]),
        },
      });

      if (heldTickets.length && !reservation_id) {
        throw new Error(
          "Hay tickets reservados. El pago debe realizarse desde una reserva"
        );
      }

      let tickets: Ticket[] = [];
      let reservation: Reservation | null = null;

      if (reservation_id) {
        reservation = await manager.getRepository(Reservation).findOne({
          where: { id: reservation_id },
          relations: [
            "user",
            "raffle",
            "reservationTickets",
            "reservationTickets.ticket",
          ],
        });

        if (!reservation) throw new Error("No se encontró la reserva");
        if (reservation.user.id !== userId)
          throw new Error("La reserva no pertenece al usuario");

        tickets = reservation.reservationTickets
          .map((rt) => rt.ticket)
          .filter((t) => ticket_ids.includes(t.id_ticket));

        if (!tickets.length)
          throw new Error("No hay tickets válidos en la reserva");

        for (const ticket of tickets) {
          const belongsToReservation = reservation.reservationTickets.some(
            (rt) => rt.ticket.id_ticket === ticket.id_ticket
          );

          if (!belongsToReservation) {
            throw new Error(
              `El ticket ${ticket.id_ticket} no pertenece a esta reserva`
            );
          }

          if (ticket.status === TicketStatus.AVAILABLE) {
            throw new Error(
              `El ticket ${ticket.id_ticket} no pertenece a esta reserva`
            );
          }

          if (ticket.status === TicketStatus.PURCHASED) {
            throw new Error(`El ticket ${ticket.id_ticket} ya fue comprado`);
          }

          if (
            ticket.status === TicketStatus.HELD &&
            ticket.held_until &&
            ticket.held_until < new Date()
          ) {
            throw new Error(
              `El ticket ${ticket.id_ticket} tiene el hold expirado`
            );
          }
        }
      }
      else {
        tickets = await manager.getRepository(Ticket).find({
          where: { id_ticket: In(ticket_ids) },
          relations: ["raffle"],
        });

        if (!tickets.length)
          throw new Error("No hay tickets seleccionados");

        for (const ticket of tickets) {
          if (ticket.status !== TicketStatus.AVAILABLE) {
            throw new Error(
              `El ticket ${ticket.id_ticket} no está disponible`
            );
          }
        }
      }

      const totalAmount = tickets.length * Number(raffle.price);

      const payment = manager.getRepository(Payment).create({
        user,
        raffle,
        total_amount: totalAmount,
        status: PaymentStatus.PENDING,
        reference,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      });

      await manager.getRepository(Payment).save(payment);
      for (const ticket of tickets) {
        const detail = manager.getRepository(PaymentDetail).create({
          payment,
          ticket,
          amount: Number(raffle.price),
        });

        await manager.getRepository(PaymentDetail).save(detail);

        ticket.status = TicketStatus.HELD;
        ticket.held_until = new Date(Date.now() + 15 * 60 * 1000);
        await manager.getRepository(Ticket).save(ticket);
      }

      if (reservation) {
        await manager.getRepository(Reservation).delete(reservation.id);
      }

      return {
        payment_id: payment.id,
        reference,
        amount_in_cents: totalAmount * 100,
        currency: "COP",
      };
    });
  }



  async handleWompiWebhook(
    event: any,
    rawBody: string,
    headers: any,
    res: Response
  ) {
    try {
      if (process.env.WOMPI_MODE === "production") {
        const checksum = headers["x-event-checksum"] as string;
        const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

        if (!checksum || !integritySecret) {
          return res.status(400).json({ message: "Firma no encontrada" });
        }

        const generatedHash = crypto
          .createHash("sha256")
          .update(rawBody + integritySecret)
          .digest("hex");

        if (generatedHash !== checksum) {
          return res.status(401).json({ message: "Firma inválida" });
        }
      } else {
        console.log("Modo sandbox: no se verifica firma de Wompi");
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

      if (payment.status !== PaymentStatus.PENDING) {
        return res.status(200).json({ message: "Evento ya procesado" });
      }

      payment.transaction_id = tx.id;

      switch (tx.status) {
        case "APPROVED":
          payment.status = PaymentStatus.COMPLETED;
          for (const d of payment.details) {
            d.ticket.status = TicketStatus.PURCHASED;
            d.ticket.purchased_at = new Date();
            await this.ticketRepository.save(d.ticket);
          }
          break;

        case "DECLINED":
        case "ERROR":
          payment.status = PaymentStatus.CANCELLED;
          for (const d of payment.details) {
            d.ticket.status = TicketStatus.AVAILABLE;
            d.ticket.held_until = null;
            await this.ticketRepository.save(d.ticket);
          }
          break;
      }

      await this.paymentRepo.save(payment);

      return res.status(200).json({ message: "Webhook procesado correctamente" });

    } catch (error) {
      console.error("Error en webhook Wompi:", error);
      return res.status(500).json({ message: "Error interno procesando webhook" });
    }
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
