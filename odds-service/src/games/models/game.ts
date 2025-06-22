export interface Game {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
  link?: string;
  sid?: string;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
  link?: string;
  sid?: string;
}

export interface Outcome {
  name: string;
  price: number;
}