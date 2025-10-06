import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Payment } from "./payment.entity";
import { Ticket } from "./ticket.entity";



@Entity('payment_details')
export class PaymentDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Payment, payment => payment.details)
  payment!: Payment;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticketId', referencedColumnName: 'id_ticket' })  
  ticket!: Ticket;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;  
}
