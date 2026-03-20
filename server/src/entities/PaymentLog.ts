import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from "typeorm";

@Entity("payment_logs")
export class PaymentLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column("int")
    payment_id!: number;

    @Column("varchar")
    event!: string

    @Column("text", { nullable: true })
    message!: string;

    @CreateDateColumn()
    created_at!: Date;
}