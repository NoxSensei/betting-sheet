import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm";
import { BookmakerEntity } from "./bookmaker.entity";
import { OutcomeEntity } from "./outcome.entity";

@Entity()
@Index(["key", "bookmakerId"], { unique: true })
export class MarketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  lastUpdate: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  sid?: string;

  @ManyToOne(() => BookmakerEntity, bookmaker => bookmaker.markets)
  @JoinColumn({ name: 'bookmakerId' })
  bookmaker: BookmakerEntity;

  @Column()
  bookmakerId: number;

  @OneToMany(() => OutcomeEntity, outcome => outcome.market, { cascade: true })
  outcomes: OutcomeEntity[];
} 
