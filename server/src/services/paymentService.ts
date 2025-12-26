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
  async createPayment(payment: {
    raffle_id: number;
    ticket_ids: number[];
    reservation_id?: number;
    user_id: number;
    reference: string;
  }) {
    return await this.dataSource.transaction(async (manager) => {
      /** =========================
       *  1. Usuario y rifa
       * ========================= */
      const user = await manager.getRepository(User).findOne({
        where: { id: payment.user_id },
      });
      if (!user) throw new Error("No se encontró el usuario");

      const raffle = await manager.getRepository(Raffle).findOne({
        where: { id: payment.raffle_id },
      });
      if (!raffle) throw new Error("No se encontró la rifa");

      /** =========================
       *  2. Tickets
       * ========================= */
      let tickets: Ticket[] = [];
      let reservation: Reservation | null = null;

      // 🔹 CASO A: pago desde reserva
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

        // 🔐 Validación CLAVE
        for (const ticket of tickets) {
          const belongsToReservation = reservation.reservationTickets.some(
            (rt) => rt.ticket.id_ticket === ticket.id_ticket
          );

          if (!belongsToReservation) {
            throw new Error(
              `El ticket ${ticket.id_ticket} no pertenece a esta reserva`
            );
          }

          // ✅ validación correcta
          if (ticket.status === "available") {
            throw new Error(`El ticket ${ticket.id_ticket} no pertenece a esta reserva`);
          }

          if (ticket.status === "purchased" || ticket.status === "completed") {
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

      // 🔹 CASO B: compra directa
      else {
        tickets = await manager.getRepository(Ticket).find({
          where: { id_ticket: In(payment.ticket_ids) },
          relations: ["raffle"],
        });

        if (!tickets.length) {
          throw new Error("No hay tickets seleccionados");
        }

        for (const ticket of tickets) {
          if (ticket.status !== "available") {
            throw new Error(
              `El ticket ${ticket.id_ticket} no está disponible`
            );
          }
        }
      }

      /** =========================
       *  3. Crear pago
       * ========================= */
      const totalAmount = tickets.length * Number(raffle.price);

      const paymentEntity = manager.getRepository(Payment).create({
        user,
        raffle,
        total_amount: totalAmount,
        status: "completed",
        transaction_id: `TX-${Date.now()}`,
        reference: payment.reference,
      });

      await manager.getRepository(Payment).save(paymentEntity);

      /** =========================
       *  4. Detalles + tickets
       * ========================= */
      for (const ticket of tickets) {
        const detail = manager.getRepository(PaymentDetail).create({
          payment: paymentEntity,
          ticket,
          amount: Number(raffle.price),
        });

        await manager.getRepository(PaymentDetail).save(detail);

        ticket.status = "purchased";
        ticket.purchased_at = new Date();
        ticket.held_until = null;

        await manager.getRepository(Ticket).save(ticket);
      }

      /** =========================
       *  5. Cerrar reserva
       * ========================= */
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
      /** =========================
       *  1. Usuario y rifa
       * ========================= */
      const user = await manager.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) throw new Error("Usuario no encontrado");

      const raffle = await manager.getRepository(Raffle).findOne({
        where: { id: raffle_id },
      });
      if (!raffle) throw new Error("Rifa no encontrada");

      /** =========================
       *  2. Blindaje: tickets reservados sin reservation_id
       * ========================= */
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

      /** =========================
       *  3. Obtener tickets
       * ========================= */
      let tickets: Ticket[] = [];
      let reservation: Reservation | null = null;

      // 🔹 CASO A: pago desde reserva (IGUAL a createPayment)
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

          // ❌ available nunca es válido en reserva
          if (ticket.status === "available") {
            throw new Error(
              `El ticket ${ticket.id_ticket} no pertenece a esta reserva`
            );
          }

          // ❌ ya comprado
          if (ticket.status === "purchased" || ticket.status === "completed") {
            throw new Error(`El ticket ${ticket.id_ticket} ya fue comprado`);
          }

          // ❌ hold expirado
          if (
            ticket.status === "held" &&
            ticket.held_until &&
            ticket.held_until < new Date()
          ) {
            throw new Error(
              `El ticket ${ticket.id_ticket} tiene el hold expirado`
            );
          }
        }
      }

      // 🔹 CASO B: compra directa
      else {
        tickets = await manager.getRepository(Ticket).find({
          where: { id_ticket: In(ticket_ids) },
          relations: ["raffle"],
        });

        if (!tickets.length)
          throw new Error("No hay tickets seleccionados");

        for (const ticket of tickets) {
          if (ticket.status !== "available") {
            throw new Error(
              `El ticket ${ticket.id_ticket} no está disponible`
            );
          }
        }
      }

      /** =========================
       *  4. Crear pago (pendiente)
       * ========================= */
      const totalAmount = tickets.length * Number(raffle.price);

      const payment = manager.getRepository(Payment).create({
        user,
        raffle,
        total_amount: totalAmount,
        status: "pending",
        reference,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      });

      await manager.getRepository(Payment).save(payment);

      /** =========================
       *  5. Crear detalles y pasar tickets a HOLD
       * ========================= */
      for (const ticket of tickets) {
        const detail = manager.getRepository(PaymentDetail).create({
          payment,
          ticket,
          amount: Number(raffle.price),
        });

        await manager.getRepository(PaymentDetail).save(detail);

        ticket.status = "held";
        ticket.held_until = new Date(Date.now() + 15 * 60 * 1000);
        await manager.getRepository(Ticket).save(ticket);
      }

      /** =========================
       *  6. Eliminar reserva
       * ========================= */
      if (reservation) {
        await manager.getRepository(Reservation).delete(reservation.id);
      }

      /** =========================
       *  7. Respuesta Wompi
       * ========================= */
      return {
        payment_id: payment.id,
        reference,
        amount_in_cents: totalAmount * 100,
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
