import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BetsApiService {
    constructor(private readonly httpService: HttpService) {}

    async finalizeBet(gameId: number, winner: string): Promise<void> {
        const response = this.httpService.post(`${process.env.BETS_API_URL}/bets/finalize`, { winner, gameId });
        await firstValueFrom(response);
    }
}
