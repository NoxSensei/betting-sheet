import { Body, Controller, Logger, Post } from "@nestjs/common";
import { SheetsService } from "../services/sheets.service";

@Controller('events')
export class SheetsController {
    private readonly logger = new Logger(SheetsController.name);
    
    constructor(private readonly sheetsService: SheetsService) {}

    @Post('/bet-created')
    async handleBetCreate(@Body() body: any) {
        this.logger.log(`Received bet created event: ${JSON.stringify(body)}`);
        return this.sheetsService.handleBetCreate(body);
    }

    @Post('/game-created')
    async handleGameCreate(@Body() body: any) {
        this.logger.log(`Received game created event: ${JSON.stringify(body)}`);
        return this.sheetsService.handleGameCreate(body);
    }

    @Post('/bet-finalized')
    async handleBetFinalized(@Body() body: any) {
        this.logger.log(`Received bet finalized event: ${JSON.stringify(body)}`);
        return this.sheetsService.handleBetFinalized(body);
    }
}