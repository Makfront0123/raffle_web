import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { Prize } from "./prize.entity";
import { Payment } from "./payment.entity";
import { Reservation } from "./reservation.entity";

@Entity('raffle')
export class Raffle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int' })
  total_numbers!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'text' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamp' })
  end_date!: Date;

  @Column({ type: 'int' })
  digits!: number;
  @OneToMany(() => Ticket, ticket => ticket.raffle)
  tickets!: Ticket[];



  @OneToMany(() => Prize, prize => prize.raffle)
  prizes!: Prize[];

  @OneToMany(() => Payment, payment => payment.raffle)
  payments!: Payment[];

  @OneToMany(() => Reservation, (reservation) => reservation.raffle)
  reservations!: Reservation[];
}
