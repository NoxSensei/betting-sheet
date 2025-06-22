import { Injectable } from "@nestjs/common";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { ConfigService } from "@nestjs/config";
import { GamesSheetService } from "./games-sheet.service";
import { BetsSheetService } from "./bets-sheet.service";
import { UserResultsSheetService } from "./user-results-sheet.service";

@Injectable()
export class SheetsService {
    private readonly doc: GoogleSpreadsheet;

    constructor(configService: ConfigService, private readonly gamesSheetService: GamesSheetService, private readonly betsSheetService: BetsSheetService, private readonly userResultsSheetService: UserResultsSheetService) {
        const serviceAccountAuth = new JWT({
            email: configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
            key: configService.get('GOOGLE_PRIVATE_KEY'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });

        this.doc = new GoogleSpreadsheet(configService.get('GOOGLE_SHEET_ID')!, serviceAccountAuth);
    }


    async handleGameCreate(body: any) {
        await this.gamesSheetService.addGame(body, this.doc);
    }

    async handleBetCreate(body:any) {
        await this.betsSheetService.addBet(body, this.doc);
    }

    async handleBetFinalized(body: any) {
        await this.userResultsSheetService.addBet(body, this.doc);
    }
}   
