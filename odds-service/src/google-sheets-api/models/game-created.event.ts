export class GameCreatedEvent {
    id: string;
    name: string;
    homeTeam: string;
    awayTeam: string;
    bookmaker: string;
    market: string;
    oddName: string;
    oddValue: number;
}