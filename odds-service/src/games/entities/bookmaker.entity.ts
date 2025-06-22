import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm";
import { GameEntity } from "./game.entity";
import { MarketEntity } from "./market.entity";

@Entity()
@Index(["key", "gameId"], { unique: true })
export class BookmakerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  title: string;

  @Column()
  lastUpdate: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  sid?: string;

  @ManyToOne(() => GameEntity, game => game.bookmakers)
  @JoinColumn({ name: 'gameId' })
  game: GameEntity;

  @Column()
  gameId: number;

  @OneToMany(() => MarketEntity, market => market.bookmaker, { cascade: true })
  markets: MarketEntity[];
} 
