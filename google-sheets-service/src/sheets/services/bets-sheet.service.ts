import { Injectable } from "@nestjs/common";
import { GoogleSpreadsheet } from "google-spreadsheet";

@Injectable()
export class BetsSheetService {
    private readonly betsSheetName = 'bets';
    
    async addBet(body: any, doc: GoogleSpreadsheet) {
        const sheet = await this.getOrCreateBetsSheet(doc);

        await sheet.addRow({ 
            outcomeId: body.outcomeId, 
            amount: body.amount,
            timestamp: new Date().toISOString()
        });

    }

    private async getOrCreateBetsSheet(doc: GoogleSpreadsheet) {
        await doc.loadInfo();
        
        let betsSheet = doc.sheetsByTitle[this.betsSheetName];
        
        if (!betsSheet) {
            betsSheet = await doc.addSheet({ 
                title: this.betsSheetName,
                headerValues: ['outcomeId', 'amount'] 
            });
        }
        
        return betsSheet;
    }

}