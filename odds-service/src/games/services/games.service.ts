import { Injectable, Logger } from "@nestjs/common";
import { TheOddsApiService } from "./the-odds-api.service";
import { GamesRepository } from "../repositories/games.repository";
import { BookmakerRepository } from "../repositories/bookmaker.repository";
import { MarketRepository } from "../repositories/market.repository";
import { OutcomeRepository } from "../repositories/outcome.repository";
import { Bookmaker, Game, Market, Outcome } from "../models/game";
import { GameEntity } from "../entities/game.entity";
import { BookmakerEntity } from "../entities/bookmaker.entity";
import { MarketEntity } from "../entities/market.entity";
import { OutcomeEntity } from "../entities/outcome.entity";
import { GameStatus } from "../models/game-status";
import { GoogleSheetsApiService } from "src/google-sheets-api/services/google-sheets-api.service";

@Injectable()
export class GamesService {
    private readonly logger = new Logger(GamesService.name);

    constructor(
        private readonly oddsApiService: TheOddsApiService,
        private readonly gamesRepository: GamesRepository,
        private readonly bookmakerRepository: BookmakerRepository,
        private readonly marketRepository: MarketRepository,
        private readonly outcomeRepository: OutcomeRepository,
        private readonly googleSheetsApiService: GoogleSheetsApiService
    ) {}

    async refreshGamesData() {
        this.logger.log("Fetching games data");
        const games = await this.oddsApiService.getGames();

        await this.finalizeGames(games);

        this.logProcessingStats(games);
        await this.processGamesData(games);

        this.logger.log("Games data refreshed");
    }

    private async finalizeGames(games: Game[]): Promise<void> {
        await this.gamesRepository.completeNotListedGames(games.map(game => game.id));
    }

    private async processGamesData(games: Game[]): Promise<void> {        
        for (const game of games) {
            const gameEntity = this.mapGameToEntity(game);
            const savedGame = await this.gamesRepository.save(gameEntity);

            if (!savedGame) {
                this.logger.error(`Game not found after upsert: externalId: ${gameEntity.externalId}`);
                continue;
            }

            for (const bookmaker of game.bookmakers) {
                const bookmakerEntity = this.mapBookmakerToEntity(bookmaker, savedGame.id);
                const savedBookmaker = await this.bookmakerRepository.save(bookmakerEntity);

                if (!savedBookmaker) {
                    this.logger.error(`Bookmaker not found after upsert: key: ${bookmaker.key} gameId: ${gameEntity.id}`);
                    continue;
                }

                for (const market of bookmaker.markets) {
                    const marketEntity = this.mapMarketToEntity(market, savedBookmaker.id);
                    const savedMarket = await this.marketRepository.save(marketEntity);

                    if (!savedMarket) {
                        this.logger.error(`Market not found after upsert: key: ${marketEntity.key} bookmakerId: ${savedBookmaker.id}`);
                        continue;
                    }

                    for (const outcome of market.outcomes) {
                        const outcomeEntity = this.mapOutcomeToEntity(outcome, savedMarket.id);
                        const savedOutcome = await this.outcomeRepository.save(outcomeEntity);

                        if (!savedOutcome) {
                            this.logger.error(`Outcome not found after upsert: name: ${outcomeEntity.name} marketId: ${savedMarket.id}`);
                            continue;
                        }

                        await this.sendGameCreatedEvent(game, bookmaker, market, outcome);
                    }
                }
            }
        }
    }

    private async sendGameCreatedEvent(game: Game, bookmaker: Bookmaker, market: Market, outcome: Outcome): Promise<void> {
        const gameCreatedEvent = {
            id: game.id,
            name: game.sport_title,
            homeTeam: game.home_team,
            awayTeam: game.away_team,
            bookmaker: bookmaker.title,
            market: market.key,
            oddName: outcome.name,
            oddValue: outcome.price,
        };

        await this.googleSheetsApiService.postGameCreated(gameCreatedEvent);
    }

    private logProcessingStats(odds: Game[]): void {
        let totalBookmakers = 0;
        let totalMarkets = 0;
        let totalOutcomes = 0;

        for (const odd of odds) {
            totalBookmakers += odd.bookmakers.length;
            for (const bookmaker of odd.bookmakers) {
                totalMarkets += bookmaker.markets.length;
                for (const market of bookmaker.markets) {
                    totalOutcomes += market.outcomes.length;
                }
            }
        }

        this.logger.log(`Processing ${odds.length} odds, ${totalBookmakers} bookmakers, ${totalMarkets} markets, ${totalOutcomes} outcomes`);
    }

    private mapGameToEntity(game: Game): Partial<GameEntity> {
        return {
            externalId: game.id,
            sportKey: game.sport_key,
            sportTitle: game.sport_title,
            commenceTime: game.commence_time,
            homeTeam: game.home_team,
            awayTeam: game.away_team,
            status: GameStatus.Running,
        };
    }

    mapBookmakerToEntity(bookmaker: any, gameId: number): Partial<BookmakerEntity> {
        return {
            key: bookmaker.key,
            title: bookmaker.title,
            lastUpdate: bookmaker.last_update,
            link: bookmaker.link,
            sid: bookmaker.sid,
            gameId: gameId,
        };
    }

    mapMarketToEntity(market: any, bookmakerId: number): Partial<MarketEntity> {
        return {
            key: market.key,
            lastUpdate: market.last_update,
            link: market.link,
            sid: market.sid,
            bookmakerId: bookmakerId,
        };
    }

    mapOutcomeToEntity(outcome: any, marketId: number): Partial<OutcomeEntity> {
        return {
            name: outcome.name,
            price: outcome.price,
            marketId: marketId,
        };
    }
}
