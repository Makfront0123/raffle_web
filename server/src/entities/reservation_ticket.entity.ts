 
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Reservation } from "./reservation.entity";
import { Ticket } from "./ticket.entity";

@Entity('reservation_tickets')
export class ReservationTicket {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.reservationTickets, { onDelete: 'CASCADE' })
  reservation!: Reservation;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticketIdTicket', referencedColumnName: 'id_ticket' })
  ticket!: Ticket;
}
