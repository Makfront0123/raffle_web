// src/entities/reservation.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Raffle } from "./raffle.entity";
import { ReservationTicket } from "./reservation_ticket.entity";

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Raffle, (raffle) => raffle.reservations, { onDelete: 'CASCADE' })
  raffle!: Raffle;

  @OneToMany(() => ReservationTicket, (resTicket) => resTicket.reservation, { cascade: true })
  reservationTickets!: ReservationTicket[];

  @CreateDateColumn()
  created_at!: Date;
  @Column({ type: 'timestamp', nullable: true })
  cancelled_at?: Date;

  @Column({ type: 'timestamp' })
  expires_at!: Date;
}
