import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GameCreatedEvent } from '../models/game-created.event';

@Injectable()
export class GoogleSheetsApiService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    async postGameCreated(game: GameCreatedEvent) {
        const googleSheetsApiUrl = this.configService.get<string>('GOOGLE_SHEETS_API_URL');
        if (!googleSheetsApiUrl) {
            throw new Error('GOOGLE_SHEETS_API_URL is not configured');
        }

        const endpointUrl = `${googleSheetsApiUrl}/events/game-created`;
        await firstValueFrom(
            this.httpService.post(endpointUrl, game)
        );
    }
}
