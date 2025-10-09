
import { Payment } from '../entities/payment.entity';
import { PaymentDetail } from '../entities/payment_details.entity';
import { User } from '../entities/user.entity';
import { Raffle } from '../entities/raffle.entity';
import { AppDataSource } from '../data-source';
import { ticketRepository } from '../repositories/ticketRepository';
import { paymentDetailRepository } from '../repositories/paymentDetailRepository';
import { Ticket } from '../entities/ticket.entity';
import { In } from 'typeorm';
import { db } from '../config/db';

export class PaymentService {
  async getAllPayments() {
    const paymentRepo = AppDataSource.getRepository(Payment);
    return await paymentRepo.find({ relations: ['user', 'raffle'] });
  }
  async createPayment(payment: any) {

    const paymentRepo = AppDataSource.getRepository(Payment);
    const userRepo = AppDataSource.getRepository(User);
    const raffleRepo = AppDataSource.getRepository(Raffle);

    //BUSCAR USUARIO Y FIFA
    const user = await userRepo.findOne({ where: { id: payment.user_id } });
    if (!user) throw new Error('No se encontró el usuario');

    const raffle = await raffleRepo.findOne({ where: { id: payment.raffle_id } });
    if (!raffle) throw new Error('No se encontró la rifa');

    //VERIFICAR TICKETS SELECCIONADOS
    const tickets = await ticketRepository.findByIds(payment.ticket_ids);
    if (tickets.length === 0) throw new Error('No hay tickets seleccionados');


    for (const ticket of tickets) {
      if (ticket.raffleId !== raffle.id) throw new Error(`El ticket ${ticket.id_ticket} no pertenece a esta rifa`);
      if (ticket.status !== 'available') throw new Error(`El ticket ${ticket.id_ticket} ya fue comprado`);
    }



    //CALCULAR EL TOTAL DEL PAGO
    const totalAmount = tickets.length * Number(raffle.price);

    // CREAR REGISTRO DE PAGO
    const paymentEntity = paymentRepo.create({
      user,
      raffle,
      total_amount: totalAmount,
      status: 'pending', // por defecto
      method: payment.method || 'manual',
      transaction_id: `TX-${Date.now()}`,
    });

    await paymentRepo.save(paymentEntity);

    // CREAR REGISTROS DE DETALLE DE PAGO
    for (const ticket of tickets) {
      const detail = {
        paymentId: paymentEntity.id,
        ticketIdTicket: ticket.id_ticket,
        amount: Number(raffle.price),
      };
      await paymentDetailRepository.save(detail);


      //ACTUALIZAR ESTADO DEL TICKET Y ASIGNAR USUARIO
      ticket.status = 'purchased';
      ticket.purchased_at = new Date();
      await ticketRepository.save(ticket);
    }

    //RETORNAR EL RESUMEN DEL PAGO
    return {
      message: 'Pago registrado correctamente',
      payment_id: paymentEntity.id,
      total_amount: totalAmount,
      tickets: tickets.map((t: Ticket) => ({
        id: t.id_ticket,
        number: t.ticket_number,
        status: t.status,
      })),
    };

  }

  async getPaymentById(id: number) {
    const paymentRepo = AppDataSource.getRepository(Payment);
    return await paymentRepo.findOne({
      where: { id },
      relations: ['details', 'user', 'raffle'],
    });
  }

  async deletePayment(id: number) {
    const paymentRepo = AppDataSource.getRepository(Payment);
    await paymentRepo.delete({ id });
  }

  async updatePayment(id: number, payment: any) {
    const paymentRepo = AppDataSource.getRepository(Payment);
    const paymentEntity = await paymentRepo.findOne({ where: { id } });
    if (!paymentEntity) throw new Error("No se encontró el pago");

    Object.assign(paymentEntity, payment);
    await paymentRepo.save(paymentEntity);
    return paymentEntity;
  }
  async completePayment(paymentId: number) {
    const paymentRepo = AppDataSource.getRepository(Payment);
    const payment = await paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['details', 'details.ticket']
    });

    if (!payment) throw new Error('Pago no encontrado');

    payment.status = 'completed';
    await paymentRepo.save(payment);

    for (const d of payment.details) {
      d.ticket.status = 'purchased';
      await ticketRepository.save(d.ticket);
    }
  }

  async cancelPayment(paymentId: number) {
    const paymentRepo = AppDataSource.getRepository(Payment);
    const ticketRepo = AppDataSource.getRepository(Ticket);
    const detailsRepo = AppDataSource.getRepository(PaymentDetail);

    // Buscar el pago con sus detalles y tickets
    const payment = await paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['details', 'details.ticket']
    });

    if (!payment) throw new Error('Pago no encontrado');

    payment.status = 'cancelled';
    payment.cancelled_at = new Date();
    await paymentRepo.save(payment);


    // Liberar los tickets asociados
    for (const detail of payment.details) {
      detail.ticket.status = 'available';
      detail.ticket.purchased_at = null;
      await ticketRepo.save(detail.ticket);
    }

    return {
      message: `Pago #${paymentId} cancelado correctamente. Tickets liberados.`,
    };
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