import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BookmakerEntity } from "./bookmaker.entity";

@Entity()
@Unique(['externalId'])
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: string;

  @Column()
  sportKey: string;

  @Column()
  sportTitle: string;

  @Column()
  commenceTime: string;

  @Column()
  homeTeam: string;

  @Column()
  awayTeam: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  winner?: string;

  @Column({ nullable: true })
  homeTeamScore?: number;

  @Column({ nullable: true })
  awayTeamScore?: number;

  @OneToMany(() => BookmakerEntity, bookmaker => bookmaker.game, { cascade: true })
  bookmakers: BookmakerEntity[];
} 
