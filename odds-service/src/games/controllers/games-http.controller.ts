import { Controller, HttpCode, Post } from "@nestjs/common";
import { GamesResultsService } from "../services/games-results.service";
import { GamesService } from "../services/games.service";

@Controller('games')
export class GamesHttpController {
    constructor(private readonly gamesService: GamesService, private readonly gamesResultsService: GamesResultsService) {}

    @Post('/refresh')
    @HttpCode(204)
    async refreshGamesData() {
        return this.gamesService.refreshGamesData();
    }

    @Post('/generate-results')
    @HttpCode(204)
    async generateGamesResults() {
        return this.gamesResultsService.generateGamesResults();
    }
}
