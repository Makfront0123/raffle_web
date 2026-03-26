import { AppDataSource } from "../data-source";
import { Reservation } from "../entities/reservation.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import { Ticket, TicketStatus } from "../entities/ticket.entity";
import { In, LessThan } from "typeorm";
import { Raffle } from "../entities/raffle.entity";


export class ReservationService {
  private dataSource: any;

  constructor(dataSource = AppDataSource) {
    this.dataSource = dataSource;
  }

  private getRepo(entity: any) {
    return this.dataSource.getRepository(entity);
  }

  private createQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  async getAllReservationsByUser(userId: number) {
    return this.getRepo(Reservation).find({
      where: { user: { id: userId } },
      relations: ['reservationTickets', 'reservationTickets.ticket', 'raffle'],
    });
  }


  async createReservation(userId: number, raffleId: number, ticketIds: number[]) {
    const queryRunner = this.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const raffle = await this.getRepo(Raffle).findOne({
        where: { id: raffleId }
      });

      if (!raffle) throw new Error('Rifa no encontrada.');
      if (raffle.status !== 'active') throw new Error('La rifa no está activa.');

      const tickets = await queryRunner.manager
        .createQueryBuilder(Ticket, "ticket")
        .leftJoinAndSelect("ticket.raffle", "raffle")
        .setLock("pessimistic_write")
        .where("ticket.id_ticket IN (:...ids)", { ids: ticketIds })
        .getMany();

      if (tickets.length !== ticketIds.length) {
        throw new Error('Algunos tickets no existen.');
      }

      const invalidTickets = tickets.filter(
        (t: Ticket) => !t.raffle || t.raffle.id !== raffleId
      );

      if (invalidTickets.length > 0) {
        throw new Error('Uno o más tickets no pertenecen a esta rifa.');
      }

      const unavailable = tickets.filter(
        (t: Ticket) => t.status !== TicketStatus.AVAILABLE
      );

      if (unavailable.length > 0) {
        throw new Error('Uno o más tickets ya no están disponibles.');
      }

      const existingReservations = await queryRunner.manager
        .createQueryBuilder(Reservation, "reservation")
        .leftJoinAndSelect("reservation.reservationTickets", "rt")
        .where("reservation.userId = :userId", { userId })
        .andWhere("reservation.raffleId = :raffleId", { raffleId })
        .andWhere("reservation.expires_at > :now", { now: new Date() })
        .getMany();

      const existingCount = existingReservations.reduce(
        (acc: number, r: Reservation) => acc + r.reservationTickets.length,
        0
      );

      const maxTicketsPerUser = 5;

      if (existingCount + ticketIds.length > maxTicketsPerUser) {
        throw new Error(
          `Solo puedes tener ${maxTicketsPerUser} tickets activos en esta rifa.`
        );
      }

      const expiresAt = new Date(Date.now() + 30 * 60000);
      const reservation = queryRunner.manager.create(Reservation, {
        user: { id: userId } as any,
        raffle: { id: raffleId } as any,
        expires_at: expiresAt,
        reservationTickets: tickets.map((ticket: Ticket) =>
          queryRunner.manager.create(ReservationTicket, { ticket })
        )
      });

      await queryRunner.manager.save(reservation);
      await queryRunner.manager.update(
        Ticket,
        { id_ticket: In(ticketIds) },
        { status: TicketStatus.RESERVED }
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Tickets reservados exitosamente',
        reservation
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error;

    } finally {
      await queryRunner.release();
    }
  }
  async releaseExpiredReservations() {
    const queryRunner = this.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      const expired = await queryRunner.manager
        .createQueryBuilder(Reservation, "reservation")
        .leftJoinAndSelect("reservation.reservationTickets", "rt")
        .leftJoinAndSelect("rt.ticket", "ticket")
        .setLock("pessimistic_write")
        .where("reservation.expires_at < :now", { now })
        .getMany();

      if (expired.length === 0) {
        await queryRunner.commitTransaction();
        return { message: "No hay reservas expiradas." };
      }

      for (const reservation of expired) {
        for (const resTicket of reservation.reservationTickets) {
          resTicket.ticket.status = TicketStatus.AVAILABLE;
          await queryRunner.manager.save(resTicket.ticket);
        }

        await queryRunner.manager.remove(reservation);
      }

      await queryRunner.commitTransaction();
      return { message: "Reservas expiradas liberadas correctamente" };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }


  async getAllReservations() {
    return this.getRepo(Reservation).find({
      relations: ['reservationTickets', 'reservationTickets.ticket'],
    });
  }


  async getReservationById(id: number) {
    return this.getRepo(Reservation).findOne({
      where: { id },
      relations: ['reservationTickets', 'reservationTickets.ticket'],
    });
  }


  async deleteReservation(id: number, currentUserId: number) {
    const queryRunner = this.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        relations: [
          'user',
          'reservationTickets',
          'reservationTickets.ticket'
        ],
      });


      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }

      if (reservation.user.id !== currentUserId) {
        throw new Error('No se puede eliminar la reserva: No es tu propia.');
      }

      if (reservation.expires_at < new Date()) {
        throw new Error('No puedes cancelar una reserva expirada.');
      }
      const hasPurchased = reservation.reservationTickets.some(
        (rt: ReservationTicket) => rt.ticket.status === 'purchased'
      );

      if (hasPurchased) {
        throw new Error('No se puede eliminar la reserva: Uno o más tickets ya fueron comprados.');
      }

      for (const resTicket of reservation.reservationTickets) {
        resTicket.ticket.status = 'available';
        await queryRunner.manager.save(resTicket.ticket);
      }

      await queryRunner.manager.remove(reservation);

      await queryRunner.commitTransaction();
      return {
        message: 'Reserva eliminada correctamente',
        reservation,
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

}