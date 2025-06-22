import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BetEntity } from "../entities/bet.entity";
import { Repository } from "typeorm";

@Injectable()
export class BetsRepository {
    constructor(
        @InjectRepository(BetEntity)
        private readonly betRepository: Repository<BetEntity>,
    ) {}

    async createBet(bet: Omit<BetEntity, 'id'>): Promise<BetEntity> {
        return this.betRepository.save(bet);
    }

    async getBets(): Promise<BetEntity[]> {
        return this.betRepository.find();
    }

    async findBetById(id: number): Promise<BetEntity | null> {
        return this.betRepository.findOne({
            where: {
                id,
            },
        });
    }

    async updateBet(bet: BetEntity): Promise<BetEntity> {
        const existingBet = await this.findBetById(bet.id);
        if (!existingBet) {
            throw new Error(`Bet with id ${bet.id} not found`);
        }
        
        await this.betRepository.update(bet.id, bet);
        
        return (await this.findBetById(bet.id))!;
    }

    async findBetByOutcomeId(outcomeId: number): Promise<BetEntity | null> {
        return this.betRepository.findOne({
            where: {
                outcomeId,
            },
        });
    }

    async findBetsByGameId(gameId: number): Promise<any> {
        const bets = await this.betRepository.query(`
            SELECT bet_entity.* FROM bet_entity
            INNER JOIN outcome_entity ON bet_entity."outcomeId" = outcome_entity.id
            INNER JOIN market_entity ON outcome_entity."marketId" = market_entity.id
            INNER JOIN bookmaker_entity ON market_entity."bookmakerId" = bookmaker_entity.id
            INNER JOIN game_entity ON bookmaker_entity."gameId" = game_entity.id
            WHERE game_entity.id = $1
        `, [gameId]);
        return bets;
    }
}
