import { Module } from "@nestjs/common";
import { TheOddsApiService } from "./services/the-odds-api.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "./entities/game.entity";
import { BookmakerEntity } from "./entities/bookmaker.entity";
import { MarketEntity } from "./entities/market.entity";
import { OutcomeEntity } from "./entities/outcome.entity";
import { GamesRepository } from "./repositories/games.repository";
import { BookmakerRepository } from "./repositories/bookmaker.repository";
import { MarketRepository } from "./repositories/market.repository";
import { OutcomeRepository } from "./repositories/outcome.repository";
import { GamesCronController } from "./controllers/games-cron.controller";
import { GamesHttpController } from "./controllers/games-http.controller";
import { GamesService } from "./services/games.service";
import { GamesResultsService } from "./services/games-results.service";
import { GoogleSheetsApiModule } from "src/google-sheets-api/google-sheets-api.module";
import { BetsApiModule } from "src/bets-api/bets-api.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameEntity,
      BookmakerEntity,
      MarketEntity,
      OutcomeEntity,
    ]),
    GoogleSheetsApiModule,
    BetsApiModule
  ],
  controllers: [GamesHttpController],
  providers: [
    GamesCronController,
    GamesService, 
    GamesResultsService,
    TheOddsApiService, 
    GamesRepository,
    BookmakerRepository,
    MarketRepository,
    OutcomeRepository,
  ]
})
export class GamesModule {}
