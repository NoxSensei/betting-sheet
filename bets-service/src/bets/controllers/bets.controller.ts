import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateBetDto } from "../dtos/create-bet.dto";
import { BetsService } from "../services/bets.service";
import { FinalizeBetDto } from "../dtos/finalize-bet.dto";

@Controller('bets')
export class BetsController {
    constructor(private readonly betsService: BetsService) {}

    @Post()
    async createBet(@Body() createBetDto: CreateBetDto) {
        return this.betsService.createBet(createBetDto);
    }

    @Get()
    async getBets() {
        return this.betsService.getBets();
    }

    @Post('/finalize')
    @HttpCode(204)
    async finalizeBet(@Body() finalizeBetDto: FinalizeBetDto) {
        return this.betsService.finalizeBets(finalizeBetDto.gameId, finalizeBetDto.winner);
    }
}   