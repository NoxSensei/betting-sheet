import { Injectable, Logger } from "@nestjs/common";
import { GamesRepository } from "../repositories/games.repository";
import { GameEntity } from "../entities/game.entity";
import { BetsApiService } from "src/bets-api/services/bets-api.service";

@Injectable()
export class GamesResultsService {
    private readonly logger = new Logger(GamesResultsService.name);

    constructor(
        private readonly gamesRepository: GamesRepository,
        private readonly betsApiService: BetsApiService
    ) {}

    async generateGamesResults(): Promise<void> {
        const games = await this.gamesRepository.findAll();
        const gameResults: GameEntity[] = [];

        for (const game of games) {
            const gameResult = await this.generateGameResult(game);
            gameResults.push(gameResult);
        }

        for (const gameResult of gameResults) {
            await this.gamesRepository.updateGameScore(gameResult.id, gameResult.homeTeamScore!, gameResult.awayTeamScore!, gameResult.winner!);
            await this.betsApiService.finalizeBet(gameResult.id, gameResult.winner!);
        }

        this.logger.log(`Generated ${games.length} games results`);
    }

    private async generateGameResult(game: GameEntity): Promise<GameEntity> {
        game.homeTeamScore = Math.floor(Math.random() * 100);
        game.awayTeamScore = Math.floor(Math.random() * 100);
        game.winner = game.homeTeamScore > game.awayTeamScore ? game.homeTeam : game.awayTeam;
        return game;
    }
}