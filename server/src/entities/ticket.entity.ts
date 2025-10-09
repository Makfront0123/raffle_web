import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Raffle } from "./raffle.entity";
import { User } from "./user.entity";

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'id_ticket' })
  id_ticket!: number;

  @ManyToOne(() => Raffle, raffle => raffle.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'raffleId' })
  raffle!: Raffle;

  @Column()
  raffleId!: number;


  @Column()
  ticket_number!: string;


  @CreateDateColumn({ nullable: true })
  purchased_at?: Date | null;

  @Column({ type: 'text' })
  status!: string;
}
