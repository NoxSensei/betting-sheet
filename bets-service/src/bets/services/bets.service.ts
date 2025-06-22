import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BetEntity } from "../entities/bet.entity";
import { CreateBetDto } from "../dtos/create-bet.dto";
import { BetsRepository } from "../repositories/bets.repository";
import { OutcomesRepository } from "../repositories/outcomes.repository";
import { GoogleSheetsApiService } from "src/google-sheets-api/services/google-sheets-api.service";
import { BetStatus } from "../models/bet-status";

@Injectable()
export class BetsService {
    constructor(
        private readonly betsRepository: BetsRepository,
        private readonly outcomesRepository: OutcomesRepository,
        private readonly googleSheetsApiService: GoogleSheetsApiService,
    ) {}

    async createBet(bet: CreateBetDto): Promise<BetEntity> {
        const outcome = await this.outcomesRepository.findOutcomeById(bet.outcomeId);
        if (!outcome) {
            throw new NotFoundException('Outcome not found');
        }

        const betExists = await this.betsRepository.findBetByOutcomeId(bet.outcomeId);
        if (betExists) {
            throw new ConflictException('Bet already exists');
        }

        const isGameFinished = await this.outcomesRepository.isGameFinished(bet.outcomeId);
        if (isGameFinished) {
            throw new BadRequestException('Game is finished');
        }

        const newBet = this.mapBetToEntity(bet);
        const createdBet = await this.betsRepository.createBet(newBet);
        await this.googleSheetsApiService.postBetCreated({
            betId: createdBet.id,
            outcomeId: createdBet.outcomeId,
            amount: createdBet.amount
        });
        return createdBet;
    }

    async getBets(): Promise<BetEntity[]> {
        return this.betsRepository.getBets();
    }

    async finalizeBets(gameId: number, winner: string): Promise<void> {
        const bets = await this.betsRepository.findBetsByGameId(gameId);
        for (const bet of bets) {
            const outcome = await this.outcomesRepository.findOutcomeById(bet.outcomeId);
            bet.status = outcome.name === winner ? BetStatus.WON : BetStatus.LOST;
            bet.earned = bet.status === BetStatus.WON ? bet.amount * outcome.price : 0;
            await this.betsRepository.updateBet(bet);

            await this.googleSheetsApiService.postBetFinalized({
                betId: bet.id,
                amount: bet.amount,
                status: bet.status,
                earned: bet.earned
            });
        }
    }

    private mapBetToEntity(bet: CreateBetDto): Omit<BetEntity, 'id'> {
        return {
            outcomeId: bet.outcomeId,
            amount: bet.amount,
            status: BetStatus.PENDING,
        };
    }
}
