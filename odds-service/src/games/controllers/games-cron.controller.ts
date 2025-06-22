import { Controller, HttpCode, Injectable, Post } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GamesService } from "../services/games.service";

@Injectable()
export class GamesCronController {
    constructor(private readonly gamesService: GamesService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleDailyGamesRefresh() {
        console.log('Running daily games refresh cron job');
        await this.gamesService.refreshGamesData();
    }
}
