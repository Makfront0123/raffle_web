import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Ticket } from "./ticket.entity";
import { Payment } from "./payment.entity";
import { Reservation } from "./reservation.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  picture?: string;

  @ManyToOne(() => Role, role => role.users)
  role!: Role;


  @OneToMany(() => Ticket, ticket => ticket.user)
  tickets!: Ticket[];

  @OneToMany(() => Payment, payment => payment.user)
  payments!: Payment[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations!: Reservation[];

  @CreateDateColumn()
  created_at!: Date;
}
