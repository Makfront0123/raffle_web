import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Raffle } from "./raffle.entity";
import { PaymentDetail } from "./payment_details.entity";

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.payments)
  user!: User;

  @ManyToOne(() => Raffle, raffle => raffle.payments, { onDelete: 'CASCADE' })
  raffle!: Raffle;

  @Column({ type: 'varchar', length: 100, unique: true })
  reference!: string;

  @Column({ type: 'int' })
  total_amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status!: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  transaction_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  expires_at?: Date | null;

  @OneToMany(() => PaymentDetail, detail => detail.payment)
  details!: PaymentDetail[];
}
