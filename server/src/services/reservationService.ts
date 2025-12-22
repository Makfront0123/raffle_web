import { AppDataSource } from "../data-source";
import { Reservation } from "../entities/reservation.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import { Ticket } from "../entities/ticket.entity";
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

      const tickets = await queryRunner.manager.find(Ticket, {
        where: { id_ticket: In(ticketIds) },
        relations: ["raffle"],
      });

      const invalidTickets = tickets.filter((t: Ticket) => !t.raffle || t.raffle.id !== raffleId);
      if (invalidTickets.length > 0) {
        throw new Error('Uno o más tickets no pertenecen a esta rifa.');
      }
      const unavailable = tickets.filter((t: Ticket) => t.status !== 'available');
      if (unavailable.length > 0) {
        throw new Error('Uno o más tickets ya no están disponibles.');
      }

      const maxTicketsPerUser = 5;
      if (ticketIds.length > maxTicketsPerUser) {
        throw new Error(`No puedes reservar más de ${maxTicketsPerUser} tickets.`);
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

      for (const resTicket of reservation.reservationTickets) {
        resTicket.ticket.status = 'reserved';
        await queryRunner.manager.save(resTicket.ticket);
      }

      await queryRunner.commitTransaction();
      return { message: 'Tickets reservados exitosamente', reservation };

    } catch (error) {
      await queryRunner.rollbackTransaction();
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

      const expired = await queryRunner.manager.find(Reservation, {
        where: { expires_at: LessThan(now) },
        relations: ["reservationTickets", "reservationTickets.ticket"],
      });

      if (expired.length === 0) {
        await queryRunner.commitTransaction();
        return { message: "No hay reservas expiradas." };
      }

      for (const reservation of expired) {
        for (const resTicket of reservation.reservationTickets) {
          resTicket.ticket.status = "available";
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


  async deleteReservation(id: number) {
    const queryRunner = this.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        relations: ['reservationTickets', 'reservationTickets.ticket'],
      });

      if (!reservation) {
        throw new Error('Reserva no encontrada');
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