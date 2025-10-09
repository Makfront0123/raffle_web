
import { AppDataSource } from "../data-source";
import { Reservation } from "../entities/reservation.entity";
import { ReservationTicket } from "../entities/reservation_ticket.entity";
import { Ticket } from "../entities/ticket.entity";
import { In, LessThan } from "typeorm";
import { Raffle } from "../entities/raffle.entity";

export class ReservationService {
  private reservationRepo = AppDataSource.getRepository(Reservation);

  async createReservation(userId: number, raffleId: number, ticketIds: number[]) {
    console.log(userId, raffleId, ticketIds);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1️⃣ Validar que la rifa exista y esté activa
      const raffle = await AppDataSource.getRepository(Raffle).findOne({ where: { id: raffleId } });
      if (!raffle) throw new Error('Rifa no encontrada.');
      if (raffle.status !== 'active') throw new Error('La rifa no está activa.');
      // Buscar tickets
      const tickets = await queryRunner.manager.find(Ticket, {
        where: { id_ticket: In(ticketIds) },
        relations: ["raffle"],
      });

      // 3️⃣ Validar que los tickets pertenezcan a la rifa
      const invalidTickets = tickets.filter((t: Ticket) => !t.raffle || t.raffle.id !== raffleId);

      console.log(invalidTickets);
      if (invalidTickets.length > 0) throw new Error('Uno o más tickets no pertenecen a esta rifa.');


      // Validar que todos estén disponibles
      const unavailable = tickets.filter((t: Ticket) => t.status !== 'available');
      if (unavailable.length > 0) {
        throw new Error('Uno o más tickets ya no están disponibles.');
      }

      // 5️⃣ Limitar cantidad máxima de tickets por usuario
      const maxTicketsPerUser = 5; // ejemplo
      if (ticketIds.length > maxTicketsPerUser) throw new Error(`No puedes reservar más de ${maxTicketsPerUser} tickets.`);


      // Calcular expiración (10 minutos)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      // Crear reserva
      const reservation = queryRunner.manager.create(Reservation, {
        user: { id: userId } as any,
        raffle: { id: raffleId } as any,
        expires_at: expiresAt,
      });
      await queryRunner.manager.save(reservation);

      // Asociar tickets reservados
      for (const ticket of tickets) {
        const resTicket = queryRunner.manager.create(ReservationTicket, { reservation, ticket });
        await queryRunner.manager.save(resTicket);

        ticket.status = 'reserved'
        await queryRunner.manager.save(ticket);
      }


      // 9️⃣ Commit
      await queryRunner.commitTransaction();

      return { message: 'Tickets reservados exitosamente', reservation };
    } catch (error) {
      // Si algo falla → rollback
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async releaseExpiredReservations() {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      // Buscar reservas expiradas
      const expiredReservations = await queryRunner.manager.find(Reservation, {
        where: { expires_at: LessThan(now) },
        relations: ["reservationTickets", "reservationTickets.ticket"],
      });

      if (expiredReservations.length === 0) {
        console.log(`⏱️ [${now.toLocaleTimeString()}] No hay reservas expiradas.`);
        await queryRunner.commitTransaction();
        return { message: "No hay reservas expiradas." };
      }

      console.log(`⚠️ [${now.toLocaleTimeString()}] Encontradas ${expiredReservations.length} reservas expiradas.`);

      // Liberar tickets y borrar reservas
      for (const reservation of expiredReservations) {
        const ticketNumbers = reservation.reservationTickets.map(rt => rt.ticket?.ticket_number).join(", ");
        const userId = reservation.user?.id ?? "desconocido";
        const raffleId = reservation.raffle?.id ?? "desconocido";

        console.log(`🧾 Eliminando reserva #${reservation.id} (User: ${userId}, Raffle: ${raffleId})`);
        console.log(`🎟️ Tickets liberados: ${ticketNumbers}`);

        for (const resTicket of reservation.reservationTickets) {
          resTicket.ticket.status = "available";
          await queryRunner.manager.save(resTicket.ticket);
        }

        await queryRunner.manager.remove(reservation);
      }

      await queryRunner.commitTransaction();

      console.log(`✅ [${now.toLocaleTimeString()}] Se liberaron ${expiredReservations.length} reservas expiradas.\n`);
      return { message: "Reservas expiradas liberadas correctamente" };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ Error liberando reservas expiradas:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async getAllReservations() {
    return this.reservationRepo.find({
      relations: ['reservationTickets', 'reservationTickets.ticket'],
    });
  }

  async getReservationById(id: number) {
    return this.reservationRepo.findOne({
      where: { id },
      relations: ['reservationTickets', 'reservationTickets.ticket'],
    });
  }
  async deleteReservation(id: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Buscar la reserva con sus relaciones
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        relations: ['reservationTickets', 'reservationTickets.ticket'],
      });

      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }

      // 2️⃣ Validar si alguno de los tickets ya fue comprado
      const hasPurchased = reservation.reservationTickets.some(
        rt => rt.ticket.status === 'purchased'
      );

      if (hasPurchased) {
        throw new Error('No se puede eliminar la reserva: uno o más tickets ya fueron comprados.');
      }

      // 3️⃣ Liberar tickets (cambiar a available)
      for (const resTicket of reservation.reservationTickets) {
        resTicket.ticket.status = 'available';
        await queryRunner.manager.save(resTicket.ticket);
      }

      // 4️⃣ Eliminar la reserva (y sus reservation_tickets en cascada)
      await queryRunner.manager.remove(reservation);

      await queryRunner.commitTransaction();

      return { message: `Reserva #${id} eliminada correctamente y tickets liberados.` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
