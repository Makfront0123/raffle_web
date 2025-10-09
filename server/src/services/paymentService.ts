import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Payment } from "../entities/payment.entity";
import { Ticket } from "../entities/ticket.entity";

import { User } from "../entities/user.entity";
import { Raffle } from "../entities/raffle.entity";
import { PaymentDetail } from "../entities/payment_details.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";


export class PaymentService {
  private ticketRepository = AppDataSource.getRepository(Ticket);
  private paymentRepo = AppDataSource.getRepository(Payment);
  private paymentDetailRepository = AppDataSource.getRepository(PaymentDetail);
  private userRepo = AppDataSource.getRepository(User);
  private raffleRepo = AppDataSource.getRepository(Raffle);
  private reservationTicketRepo = AppDataSource.getRepository(ReservationTicket);

  async createPayment(payment: any) {
    // 1️⃣ Buscar usuario y rifa
    const user = await this.userRepo.findOne({ where: { id: payment.user_id } });
    if (!user) throw new Error("No se encontró el usuario");

    const raffle = await this.raffleRepo.findOne({ where: { id: payment.raffle_id } });
    if (!raffle) throw new Error("No se encontró la rifa");

    // 2️⃣ Obtener tickets seleccionados
    const tickets = await this.ticketRepository.findByIds(payment.ticket_ids);
    if (tickets.length === 0) throw new Error("No hay tickets seleccionados");

    // 3️⃣ Obtener reservas del usuario para esos tickets
    const userReservations = await this.reservationTicketRepo
      .createQueryBuilder("resTicket")
      .innerJoinAndSelect("resTicket.reservation", "reservation")
      .innerJoinAndSelect("reservation.user", "user")
      .innerJoinAndSelect("resTicket.ticket", "ticket")
      .where("ticket.id_ticket IN (:...ticketIds)", { ticketIds: payment.ticket_ids })
      .andWhere("user.id = :userId", { userId: payment.user_id })
      .getMany();


    // 4️⃣ Validar tickets
    for (const ticket of tickets) {
      if (ticket.raffleId !== raffle.id)
        throw new Error(`El ticket ${ticket.id_ticket} no pertenece a esta rifa`);

      if (ticket.status === "purchased")
        throw new Error(`El ticket ${ticket.id_ticket} ya fue comprado`);

      const isReservedByUser = userReservations.some(r => r.ticket.id_ticket === ticket.id_ticket);

      if (ticket.status === "reserved" && !isReservedByUser)
        throw new Error(`El ticket ${ticket.id_ticket} está reservado por otro usuario`);
    }

    // 5️⃣ Calcular total
    const totalAmount = tickets.length * Number(raffle.price);

    // 6️⃣ Crear pago
    const paymentEntity = this.paymentRepo.create({
      user,
      raffle,
      total_amount: totalAmount,
      status: "pending",
      method: payment.method || "manual",
      transaction_id: `TX-${Date.now()}`,
    });
    await this.paymentRepo.save(paymentEntity);

    // 7️⃣ Crear detalles de pago y actualizar tickets
    for (const ticket of tickets) {
      const detail = this.paymentDetailRepository.create({
        payment: paymentEntity,
        ticket: ticket,
        amount: Number(raffle.price),
      });
      await this.paymentDetailRepository.save(detail);

      ticket.status = "purchased";
      ticket.purchased_at = new Date();
      await this.ticketRepository.save(ticket);
    }

    const resTicketsToDelete = await this.reservationTicketRepo
      .createQueryBuilder("resTicket")
      .innerJoin("resTicket.reservation", "reservation")
      .innerJoin("reservation.user", "user")
      .where("resTicket.ticketIdTicket IN (:...ticketIds)", { ticketIds: tickets.map(t => t.id_ticket) })
      .andWhere("user.id = :userId", { userId: user.id })
      .getMany();

    // eliminar correctamente
    await this.reservationTicketRepo.remove(resTicketsToDelete);



    return {
      message: "Pago registrado correctamente",
      payment_id: paymentEntity.id,
      total_amount: totalAmount,
      tickets: tickets.map(t => ({
        id: t.id_ticket,
        number: t.ticket_number,
        status: t.status,
      })),
    };
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
    return await this.paymentRepo.find({ relations: ["user", "raffle"] });
  }
}



/*
{
  "raffle_id": 1,
  "ticket_ids": [101, 102, 103],
  "method": "manual"
}


*/

/*
const user = await userRepo.findOne({
  where: { id: payment.user_id },
  relations: ['role'],
});
if (!user) throw new Error('No se encontró el usuario');

// TEMPORAL: permitir que admin compre (solo en desarrollo)
if (user.role.name === 'admin') {
  console.warn('⚠️ Advertencia: admin comprando ticket (modo desarrollo activo)');
  // Más adelante puedes lanzar un error aquí:
  // throw new Error('Los administradores no pueden participar en rifas');
}

*/

/*
const tickets = await ticketRepository.find({
  where: { 
    ticket_number: In(payment.ticket_numbers),
    raffle: { id: payment.raffle_id }
  },
  relations: ['raffle'],
});

*/