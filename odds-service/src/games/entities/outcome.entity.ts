import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { MarketEntity } from "./market.entity";

@Entity()
@Index(["name", "marketId"], { unique: true })
export class OutcomeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => MarketEntity, market => market.outcomes)
  @JoinColumn({ name: 'marketId' })
  market: MarketEntity;

  @Column()
  marketId: number;
} 