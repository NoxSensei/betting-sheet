import { Module } from "@nestjs/common";
import { SheetsService } from "./services/sheets.service";
import { SheetsController } from "./controllers/events.controller";
import { GamesSheetService } from "./services/games-sheet.service";
import { BetsSheetService } from "./services/bets-sheet.service";
import { UserResultsSheetService } from "./services/user-results-sheet.service";

@Module({
    imports: [],
    controllers: [SheetsController],
    providers: [SheetsService, GamesSheetService, BetsSheetService, UserResultsSheetService],
})
export class SheetsModule {}