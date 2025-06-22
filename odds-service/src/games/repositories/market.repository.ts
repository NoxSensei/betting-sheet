import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { MarketEntity } from "../entities/market.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MarketRepository {
    constructor(
        @InjectRepository(MarketEntity) private readonly marketRepository: Repository<MarketEntity>
    ) {}

    async save(marketEntity: Partial<MarketEntity>): Promise<MarketEntity | null> {
        const result = await this.marketRepository.upsert(marketEntity, {
            conflictPaths: ['key', 'bookmakerId'],
            skipUpdateIfNoValuesChanged: true,
        });
        
        const savedMarket = await this.marketRepository.findOne({
            where: { key: marketEntity.key, bookmakerId: marketEntity.bookmakerId }
        });
        
        if (!savedMarket) {
            throw new Error(`Market not found after upsert: ${marketEntity.key}-${marketEntity.bookmakerId}`);
        }
        
        return savedMarket;
    }
} 