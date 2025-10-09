import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Raffle } from "./raffle.entity";
import { PaymentDetail } from "./payment_details.entity";


@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.payments)
  user!: User;

  @ManyToOne(() => Raffle, raffle => raffle.payments)
  raffle!: Raffle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount!: number;

  @Column({ type: 'text' })
  status!: string;

  @Column({ type: 'text' })
  method!: string;

  @Column({ type: 'text' })
  transaction_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at?: Date;
  @OneToMany(() => PaymentDetail, detail => detail.payment)
  details!: PaymentDetail[];
}
