import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Game } from "../models/game";

@Injectable()
export class TheOddsApiService {

  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly sport: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = 'https://api.the-odds-api.com/v4';
    this.apiKey = this.configService.get('THE_ODDS_API_KEY') || '';
    this.sport = 'basketball_nba';
    this.region = 'us';
  }

  async getGames(): Promise<Game[]> {
    const response = await fetch(`${this.apiUrl}/sports/${this.sport}/odds/?apiKey=${this.apiKey}&regions=${this.region}`);
    return response.json();
  }
}
