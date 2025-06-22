import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BetStatus } from "../models/bet-status";

@Entity()
export class BetEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    outcomeId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: BetStatus,
        default: BetStatus.PENDING
    })
    status: BetStatus;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
    earned?: number;
}