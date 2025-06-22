import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { BookmakerEntity } from "../entities/bookmaker.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BookmakerRepository {
    constructor(
        @InjectRepository(BookmakerEntity) private readonly bookmakerRepository: Repository<BookmakerEntity>
    ) {}

    async save(bookmakerEntity: Partial<BookmakerEntity>): Promise<BookmakerEntity | null> {
        const result = await this.bookmakerRepository.upsert(bookmakerEntity, {
            conflictPaths: ['key', 'gameId'],
            skipUpdateIfNoValuesChanged: true,
        });
        
        const savedBookmaker = await this.bookmakerRepository.findOne({
            where: { key: bookmakerEntity.key, gameId: bookmakerEntity.gameId }
        });
        
        if (!savedBookmaker) {
            throw new Error(`Bookmaker not found after upsert: key: ${bookmakerEntity.key} gameId: ${bookmakerEntity.gameId}`);
        }
        
        return savedBookmaker;
    }
} 
