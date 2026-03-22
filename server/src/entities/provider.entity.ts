import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Prize } from "./prize.entity";

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  contact_name!: string;

  @Column()
  contact_email!: string;

  @Column()
  contact_phone!: string;

  @OneToMany(() => Prize, prize => prize.provider)
  prizes!: Prize[];

  @CreateDateColumn()
  created_at!: Date;
}
