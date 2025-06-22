import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { OutcomeEntity } from "../entities/outcome.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OutcomeRepository {
    constructor(
        @InjectRepository(OutcomeEntity) private readonly outcomeRepository: Repository<OutcomeEntity>
    ) {}

    async save(outcomeEntity: Partial<OutcomeEntity>): Promise<OutcomeEntity | null> {
        const result = await this.outcomeRepository.upsert(outcomeEntity, {
            conflictPaths: ['name', 'marketId'],
            skipUpdateIfNoValuesChanged: true,
        });
        
        const savedOutcome = await this.outcomeRepository.findOne({
            where: { name: outcomeEntity.name, marketId: outcomeEntity.marketId }
        });
        
        if (!savedOutcome) {
            throw new Error(`Outcome not found after upsert: ${outcomeEntity.name}-${outcomeEntity.marketId}`);
        }
        
        return savedOutcome;
    }
} 