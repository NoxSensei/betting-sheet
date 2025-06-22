import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BetCreatedEvent } from '../models/bet-created.event';
import { BetFinalizedEvent } from '../models/bet-finalized.event';

@Injectable()
export class GoogleSheetsApiService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    async postBetCreated(bet: BetCreatedEvent) {
        const googleSheetsApiUrl = this.configService.get<string>('GOOGLE_SHEETS_API_URL');
        if (!googleSheetsApiUrl) {
            throw new Error('GOOGLE_SHEETS_API_URL is not configured');
        }

        const endpointUrl = `${googleSheetsApiUrl}/events/bet-created`;
        await firstValueFrom(
            this.httpService.post(endpointUrl, bet)
        );
    }

    async postBetFinalized(bet: BetFinalizedEvent) {
        const googleSheetsApiUrl = this.configService.get<string>('GOOGLE_SHEETS_API_URL');
        if (!googleSheetsApiUrl) {
            throw new Error('GOOGLE_SHEETS_API_URL is not configured');
        }

        const endpointUrl = `${googleSheetsApiUrl}/events/bet-finalized`;
        await firstValueFrom(
            this.httpService.post(endpointUrl, bet)
        );
    }
}
