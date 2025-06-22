import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BetEntity } from "./entities/bet.entity";
import { BetsController } from "./controllers/bets.controller";
import { BetsService } from "./services/bets.service";
import { BetsRepository } from "./repositories/bets.repository";
import { OutcomesRepository } from "./repositories/outcomes.repository";
import { GoogleSheetsApiModule } from "src/google-sheets-api/google-sheets-api.module";

@Module({
    imports: [TypeOrmModule.forFeature([BetEntity]), GoogleSheetsApiModule],
    controllers: [BetsController],
    providers: [BetsService, BetsRepository, OutcomesRepository],
})
export class BetsModule {}
