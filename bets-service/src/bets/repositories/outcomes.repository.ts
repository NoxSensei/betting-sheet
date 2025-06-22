import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class OutcomesRepository {
    constructor(
        private readonly dataSource: DataSource,
    ) {}

    async findOutcomeById(id: number): Promise<any> {
        const results = await this.dataSource.query(`SELECT * FROM outcome_entity WHERE id = $1`, [id]);
        
        return results[0] || null;
    }

    async isGameFinished(outcomeId: number): Promise<boolean> {
        const game = await this.dataSource.query(`
            SELECT * FROM outcome_entity
            INNER JOIN market_entity ON outcome_entity."marketId" = market_entity.id
            INNER JOIN bookmaker_entity ON market_entity."bookmakerId" = bookmaker_entity.id
            INNER JOIN game_entity ON bookmaker_entity."gameId" = game_entity.id
            WHERE outcome_entity.id = $1
            AND game_entity.status = 'completed'
        `, [outcomeId]);
        return game.length > 0;
    }
}
