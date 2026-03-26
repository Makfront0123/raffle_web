import { EntityManager, In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { User } from "../entities/user.entity";
import { Raffle } from "../entities/raffle.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import type { Response } from "express";
import crypto from "crypto";
import { WhatsappService } from "../services/whatpsappService";
import { Reservation } from "../entities/reservation.entity";
import { PaymentLog } from "../entities/PaymentLog";
import { sendEmail } from "../utils/sendEmail";
import { purchaseEmailTemplate } from "../templates/purchaseEmail";
export class PaymentService {
  private ticketRepository;
  private paymentRepo;
  private whatsappService;

  constructor(private dataSource = AppDataSource) {
    this.ticketRepository = dataSource.getRepository(Ticket);
    this.paymentRepo = dataSource.getRepository(Payment);
    this.whatsappService = new WhatsappService();
  }

  private async logPaymentEvent(
    paymentId: number,
    event: string,
    message?: string
  ) {
    await this.dataSource.getRepository(PaymentLog).save({
      payment_id: paymentId,
      event,
      message,
    });
  }

  private async logPaymentEventTx(
    manager: EntityManager,
    paymentId: number,
    event: string,
    message?: string
  ) {
    await manager.getRepository(PaymentLog).save({
      payment_id: paymentId,
      event,
      message,
    });
  }

  async getPaymentLogs(paymentId: number) {
    return this.dataSource.getRepository(PaymentLog).find({
      where: { payment_id: paymentId },
      order: { created_at: "ASC" },
    });
  }

  private validateRaffleIsPurchasable(raffle: Raffle) {
    if (raffle.status !== "active") {
      throw new Error("La rifa no está activa");
    }

    if (raffle.end_date && raffle.end_date < new Date()) {
      throw new Error("La rifa ya ha expirado");
    }
  }


  async sendWhatsappReceipt({
    phone,
    raffle,
    tickets,
    amount,
  }: {
    phone: string;
    raffle: Raffle;
    tickets: string[];
    amount: number;
  }) {
    await this.whatsappService.sendReceipt({
      phone,
      raffle,
      tickets,
      amount,
    });
  }

  async handleWompiWebhook(
    event: any,
    rawBody: string,
    headers: any,
    res: Response
  ) {
    let paymentId: number | null = null;

    try {
      if (process.env.WOMPI_MODE === "production") {
        const checksum = headers["x-event-checksum"] as string;
        const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

        if (!checksum || !integritySecret) {
          return res.status(400).json({ message: "Firma no encontrada" });
        }

        const signature = event.signature;
        const timestamp = event.timestamp;

        const values = signature.properties.map((prop: string) => {
          return prop
            .split(".")
            .reduce((obj: any, key: string) => obj?.[key], event.data);
        });

        const concatenated = values.join("") + timestamp + integritySecret;

        const generatedChecksum = crypto
          .createHash("sha256")
          .update(concatenated)
          .digest("hex");

        if (generatedChecksum !== checksum) {
          return res.status(401).json({ message: "Firma inválida" });
        }
      }

      const tx = event?.data?.transaction;

      if (!tx?.reference || !tx?.status) {
        return res.status(400).json({ message: "Evento inválido" });
      }

      await this.dataSource.transaction(async (manager) => {
        const payment = await manager
          .getRepository(Payment)
          .createQueryBuilder("payment")
          .setLock("pessimistic_write")
          .leftJoinAndSelect("payment.details", "details")
          .leftJoinAndSelect("details.ticket", "ticket")
          .leftJoinAndSelect("payment.raffle", "raffle")
          .leftJoinAndSelect("raffle.prizes", "prizes")
          .leftJoinAndSelect("payment.user", "user")
          .where("payment.reference = :reference", {
            reference: tx.reference,
          })
          .getOne();

        if (!payment) throw new Error("Pago no encontrado");

        paymentId = payment.id;

        if (payment.status !== PaymentStatus.PENDING) return;

        await this.logPaymentEventTx(
          manager,
          payment.id,
          "WEBHOOK_RECEIVED",
          tx.status
        );

        if (
          payment.raffle.end_date &&
          payment.raffle.end_date < new Date()
        ) {
          payment.status = PaymentStatus.CANCELLED;

          for (const d of payment.details) {
            d.ticket.status = TicketStatus.AVAILABLE;
            d.ticket.held_until = null;
            await manager.save(d.ticket);
          }

          await manager.save(payment);
          return;
        }

        payment.transaction_id = tx.id;

        switch (tx.status) {
          case "APPROVED":
            payment.status = PaymentStatus.COMPLETED;
            await this.logPaymentEventTx(manager, payment.id, "PAYMENT_APPROVED");

            for (const d of payment.details) {
              d.ticket.status = TicketStatus.PURCHASED;
              d.ticket.purchased_at = new Date();
              d.ticket.held_until = null;
              await manager.save(d.ticket);
            }
            const user = payment.user;
            const tickets = payment.details.map(d => d.ticket.ticket_number);

            await sendEmail({
              to: user.email,
              subject: `Compra confirmada - ${payment.raffle.title}`,
              text: `Tu compra fue exitosa`,
              html: purchaseEmailTemplate({
                name: user.name,
                raffleTitle: payment.raffle.title,
                tickets,
                total: payment.total_amount,
                reference: payment.reference,
                prizes: payment.raffle.prizes?.map(p => ({
                  name: p.name,
                  value: Number(p.value),
                })),
                endDate: payment.raffle.end_date ?? '',
              }),
            });
            break;

          case "DECLINED":
          case "ERROR":
            payment.status = PaymentStatus.CANCELLED;
            await this.logPaymentEventTx(manager, payment.id, "PAYMENT_DECLINED", tx.status);

            for (const d of payment.details) {
              if (d.ticket.status === TicketStatus.HELD) {
                d.ticket.status = TicketStatus.AVAILABLE;
                d.ticket.held_until = null;
                await manager.save(d.ticket);
              }
            }
            break;

          case "PENDING":
            return;
        }

        await manager.save(payment);
      });

      return res.status(200).json({ ok: true });
    } catch (error) {
      let message = "Unknown error";

      if (error instanceof Error) {
        message = error.message;
      }

      if (paymentId) {
        await this.logPaymentEvent(paymentId, "WEBHOOK_ERROR", message);
      }

      return res.status(500).json({
        message: "Error procesando webhook",
      });
    }
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
    const result = await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) throw new Error("Usuario no encontrado");

      const pendingPayments = await manager.getRepository(Payment).find({
        where: {
          user: { id: userId },
          status: PaymentStatus.PENDING,
        },
        relations: ["details"],
      });

      const totalHeldTickets = pendingPayments.reduce(
        (acc, p) => acc + p.details.length,
        0
      );

      if (totalHeldTickets > 20) {
        throw new Error("Demasiados tickets en proceso");
      }
      const raffle = await manager.getRepository(Raffle).findOne({
        where: { id: raffle_id },
      });
      if (!raffle) throw new Error("Rifa no encontrada");

      this.validateRaffleIsPurchasable(raffle);

      let tickets: Ticket[] = [];
      let reservation: Reservation | null = null;

      if (reservation_id) {
        reservation = await manager.getRepository(Reservation).findOne({
          where: { id: reservation_id },
          relations: [
            "reservationTickets",
            "reservationTickets.ticket",
          ],
        });

        if (!reservation) throw new Error("Reserva no encontrada");

        tickets = reservation.reservationTickets.map((rt) => rt.ticket);
      } else {
        tickets = await manager
          .getRepository(Ticket)
          .createQueryBuilder("ticket")
          .setLock("pessimistic_write")
          .where("ticket.id_ticket IN (:...ids)", { ids: ticket_ids })
          .getMany();

        for (const t of tickets) {
          if (t.status !== TicketStatus.AVAILABLE) {
            const unavailableTickets = tickets.filter(
              t => t.status !== TicketStatus.AVAILABLE
            );

            if (unavailableTickets.length > 0) {
              const numbers = unavailableTickets.map(t => t.ticket_number);
              throw new Error(
                `Tickets no disponibles: ${numbers.join(", ")}`
              );
            }
          }
        }
      }
      const purchasedCount = await manager
        .getRepository(PaymentDetail)
        .createQueryBuilder("detail")
        .leftJoin("detail.payment", "payment")
        .leftJoin("payment.raffle", "raffle")
        .where("payment.userId = :userId", { userId })
        .andWhere("payment.raffleId = :raffleId", { raffleId: raffle_id })
        .andWhere("payment.status = :status", {
          status: PaymentStatus.COMPLETED,
        })
        .getCount();
      const activeReservations = await manager
        .getRepository(Reservation)
        .createQueryBuilder("reservation")
        .leftJoinAndSelect("reservation.reservationTickets", "rt")
        .where("reservation.userId = :userId", { userId })
        .andWhere("reservation.raffleId = :raffleId", { raffleId: raffle_id })
        .andWhere("reservation.expires_at > :now", { now: new Date() })
        .getMany();

      const reservedCount = activeReservations.reduce(
        (acc, r) => acc + (r.reservationTickets?.length || 0),
        0
      );

      const MAX_TOTAL = 10;

      if (purchasedCount + reservedCount + tickets.length > MAX_TOTAL) {
        throw new Error(
          `Máximo ${MAX_TOTAL} tickets por usuario en esta rifa`
        );
      }

      const totalAmount = tickets.length * Number(raffle.price);

      const payment = manager.getRepository(Payment).create({
        user,
        raffle,
        total_amount: totalAmount,
        status: PaymentStatus.PENDING,
        reference,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      });

      const savedPayment = await manager.save(payment);
      await this.logPaymentEventTx(
        manager,
        savedPayment.id,
        "PAYMENT_PENDING"
      );

      for (const ticket of tickets) {
        const detail = manager.getRepository(PaymentDetail).create({
          payment: savedPayment,
          ticket,
          amount: Number(raffle.price),
        });

        await manager.save(detail);

        ticket.status = TicketStatus.HELD;
        ticket.held_until = new Date(Date.now() + 15 * 60 * 1000);
        await manager.save(ticket);
      }

      if (reservation) {
        await manager.delete(Reservation, reservation.id);
      }

      return {
        payment_id: savedPayment.id,
        reference,
        amount_in_cents: Math.round(totalAmount * 100),
        currency: "COP",
      };
    });

    return result;
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

      this.validateRaffleIsPurchasable(raffle);

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



  async getPaymentById(id: number) {
    return await this.paymentRepo.findOne({
      where: { id },
      relations: ["details", "user", "raffle"],
    });
  }


  async getRaffleById(id: number): Promise<Raffle | null> {
    return this.dataSource.getRepository(Raffle).findOne({
      where: { id },
      relations: ["prizes"],
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

  async cancelPaymentByReference(reference: string) {
    const payment = await this.paymentRepo.findOne({
      where: { reference },
      relations: ["details", "details.ticket"],
    });

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    if (payment.status !== PaymentStatus.PENDING) {
      return { message: "El pago ya fue procesado" };
    }

    payment.status = PaymentStatus.CANCELLED;
    payment.cancelled_at = new Date();

    for (const detail of payment.details) {
      if (detail.ticket.status === TicketStatus.HELD) {
        detail.ticket.status = TicketStatus.AVAILABLE;
        detail.ticket.held_until = null;
        await this.ticketRepository.save(detail.ticket);
      }
    }

    await this.paymentRepo.save(payment);

    return {
      message: "Pago cancelado y tickets liberados",
    };
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
      relations: ["user", "raffle", "details", "details.ticket"],
    });
  }

  async getPaymentUser(userId: number) {
    return await this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ["user", "raffle", "details", "details.ticket"],
    });
  }

  async sendReceiptWithValidation({
    phone,
    raffleId,
    tickets,
    amount,
    reference,
  }: {
    phone: string;
    raffleId: number;
    tickets: string[];
    amount: number;
    reference: string;
  }) {
    const payment = await this.paymentRepo.findOne({
      where: { reference },
      relations: ["details", "details.ticket", "raffle"],
    });

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error("El pago aún no ha sido confirmado");
    }
    if (payment.total_amount !== amount) {
      throw new Error("Monto inconsistente");
    }

    const paymentTickets = payment.details.map(
      (d) => d.ticket.ticket_number
    );

    const isValidTickets =
      tickets.length === paymentTickets.length &&
      tickets.every((t) => paymentTickets.includes(t));

    if (!isValidTickets) {
      throw new Error("Tickets inválidos");
    }
    await this.sendWhatsappReceipt({
      phone,
      raffle: payment.raffle,
      tickets: paymentTickets,
      amount: payment.total_amount,
    });

    return { message: "Recibo enviado correctamente" };
  }

  async simulateWebhook(reference: string, status: "APPROVED" | "DECLINED" | "ERROR" = "APPROVED") {

    const fakeEvent = {
      data: {
        transaction: {
          id: `SIMULATED_${Date.now()}`,
          reference,
          status,
        },
      },
    };

    const resFake = {
      status: (code: number) => ({
        json: (obj: any) => obj,
      }),
    } as unknown as Response;

    return this.handleWompiWebhook(fakeEvent, "", {}, resFake);
  }


  async getPaymentByReference(reference: string) {
    return this.paymentRepo.findOne({
      where: { reference },
    });
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

  async verifyPaymentManually(reference: string, force = true) {
    const payment = await this.paymentRepo.findOne({
      where: { reference },
      relations: ["details", "details.ticket", "raffle", "user"]
    });

    if (!payment) throw new Error("Transacción no encontrada");
    if (!payment.transaction_id) throw new Error("No hay transaction_id asociado al pago");
    const unavailableTickets = payment.details
      .filter(d => d.ticket.status !== TicketStatus.HELD && d.ticket.status !== TicketStatus.AVAILABLE)
      .map(d => d.ticket.ticket_number);

    const expiredTickets = payment.details
      .filter(d => d.ticket.held_until && d.ticket.held_until < new Date())
      .map(d => d.ticket.ticket_number);

    if (unavailableTickets.length || expiredTickets.length) {
      const messages = [];
      if (unavailableTickets.length) messages.push(`Tickets ya comprados: ${unavailableTickets.join(", ")}`);
      if (expiredTickets.length) messages.push(`Tickets expirados: ${expiredTickets.join(", ")}`);
      throw new Error(messages.join(". "));
    }

    if (force) {
      if (payment.status !== PaymentStatus.PENDING) {
        throw new Error(
          `No se puede aprobar este pago: estado actual ${payment.status}`
        );
      }

      payment.status = PaymentStatus.COMPLETED;
      for (const d of payment.details) {
        d.ticket.status = TicketStatus.PURCHASED;
        d.ticket.purchased_at = new Date();
        d.ticket.held_until = null;
        await this.ticketRepository.save(d.ticket);
      }
      await this.paymentRepo.save(payment);
      return payment;
    }

    const wompiResponse = await fetch(
      `https://sandbox.wompi.co/v1/transactions/${payment.transaction_id}`,
      { headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` } }
    );
    const data = await wompiResponse.json();

    if (!data.data) throw new Error("Transacción no encontrada en Wompi");

    const status = data.data.status;

    if (status === "APPROVED") {
      await this.simulateWebhook(reference, "APPROVED");
    } else if (["DECLINED", "ERROR"].includes(status)) {
      await this.simulateWebhook(reference, "DECLINED");
    }

    return await this.paymentRepo.findOne({ where: { reference } });
  }
}