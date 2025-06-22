import { Injectable, Logger } from "@nestjs/common";
import { GoogleSpreadsheet } from "google-spreadsheet";

@Injectable()
export class GamesSheetService {
    private readonly logger = new Logger(GamesSheetService.name);
    private readonly gamesSheetName = 'games';

    async addGame(body: any, doc: GoogleSpreadsheet) {
        const sheet = await this.getOrCreateGamesSheet(doc);

        const existingRow = await this.findExistingRow(sheet, body);
        if (existingRow) {
            this.logger.debug(`Row already exists for game: ${body.id}, bookmaker: ${body.bookmaker}, market: ${body.market}, outcome: ${body.oddName}`);
            return;
        }
    
        await sheet.addRow({ 
            id: body.id,
            name: body.name,
            homeTeam: body.homeTeam,
            awayTeam: body.awayTeam,
            bookmaker: body.bookmaker,
            market: body.market,
            oddName: body.oddName,
            oddValue: body.oddValue
        });
        this.logger.debug(`Created new row for game: ${body.id}, bookmaker: ${body.bookmaker}, market: ${body.market}, outcome: ${body.oddName}`);
    }

    private async findExistingRow(sheet: any, body: any): Promise<any> {
        const rows = await sheet.getRows();

        for (const row of rows) {
            if (row.get('id') === body.id &&
                row.get('bookmaker') === body.bookmaker &&
                row.get('market') === body.market &&
                row.get('oddName') === body.oddName) {
                return row;
            }
        }

        return null;
    }

    private async getOrCreateGamesSheet(doc: GoogleSpreadsheet) {
        await doc.loadInfo();
        
        let gamesSheet = doc.sheetsByTitle[this.gamesSheetName];
        
        if (!gamesSheet) {
            gamesSheet = await doc.addSheet({ 
                title: this.gamesSheetName,
                headerValues: ['id', 'name', 'homeTeam', 'awayTeam', 'bookmaker', 'market', 'oddName', 'oddValue'] 
            });
        }
        
        return gamesSheet;
    }
}