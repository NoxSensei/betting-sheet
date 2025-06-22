import { IsEnum } from "class-validator";
import { BetStatus } from "../models/bet-status";

export class FinalizeBetDto {
    gameId: number;
    winner: string;
}
