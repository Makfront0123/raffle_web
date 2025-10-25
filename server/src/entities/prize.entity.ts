import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Raffle } from "./raffle.entity";
import { Provider } from "./provider.entity";
import { Ticket } from "./ticket.entity";
export type PrizeType = 'cash' | 'trip' | 'product';
@Entity('prizes')
export class Prize {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Raffle, raffle => raffle.prizes)
  raffle!: Raffle;

  @ManyToOne(() => Provider, provider => provider.prizes, { onDelete: 'CASCADE' })
  provider!: Provider;

  @Column({
    type: 'enum',
    enum: ['cash', 'trip', 'product'],
    default: 'product'
  })
  type!: PrizeType;


  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Ticket, { nullable: true })
  winner_ticket?: Ticket;
}
