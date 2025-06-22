import { Injectable } from "@nestjs/common";
import { In, Not, Repository } from "typeorm";
import { GameEntity } from "../entities/game.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GameStatus } from "../models/game-status";

@Injectable()
export class GamesRepository {
    constructor(
        @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>
    ) {}

    async save(gameEntity: Partial<GameEntity>): Promise<GameEntity | null> {
        const result = await this.gamesRepository.upsert(gameEntity, {
            conflictPaths: ['externalId'],
            skipUpdateIfNoValuesChanged: true,
        });
        
        const savedOdd = await this.gamesRepository.findOne({
            where: { externalId: gameEntity.externalId }
        });
        
        return savedOdd;
    }

    async updateGameScore(gameId: number, homeTeamScore: number, awayTeamScore: number, winner: string): Promise<void> {
        await this.gamesRepository.update(gameId, { homeTeamScore, awayTeamScore, winner });
    }

    async completeNotListedGames(externalIds: string[]): Promise<void> {
        await this.gamesRepository.update({ externalId: Not(In(externalIds)) }, { status: GameStatus.Completed });
    }

    async findAll(): Promise<GameEntity[]> {
        return await this.gamesRepository.find();
    }
}
