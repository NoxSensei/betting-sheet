import { Injectable, Logger } from "@nestjs/common";
import { GoogleSpreadsheet } from "google-spreadsheet";

@Injectable()
export class UserResultsSheetService {
    private readonly logger = new Logger(UserResultsSheetService.name);
    private readonly userResultsSheetName = 'user-results';

    async addBet(body: any, doc: GoogleSpreadsheet) {
        const sheet = await this.getOrCreateUserResultsSheet(doc);

        const existingRow = await this.findExistingRow(sheet, body);
        if (existingRow) {
            await this.updateExistingRow(existingRow, body);
            this.logger.debug(`Updated existing row for betId: ${body.betId}`);
            return;
        }

        await sheet.addRow({ 
            betId: body.betId,
            amount: body.amount,
            status: body.status,
            earned: body.earned,
            timestamp: new Date().toISOString()
        });

        this.logger.debug(`Created new row for betId: ${body.betId}`);
    }

    private async findExistingRow(sheet: any, body: any): Promise<any> {
        const rows = await sheet.getRows();

        for (const row of rows) {
            if (row.get('betId') == body.betId) {
                return row;
            }
        }

        return null;
    }

    private async updateExistingRow(row: any, body: any): Promise<void> {
        row.set('status', body.status);
        row.set('earned', body.earned);
        await row.save();
    }

    private async getOrCreateUserResultsSheet(doc: GoogleSpreadsheet) {
        await doc.loadInfo();
        
        let userResultsSheet = doc.sheetsByTitle[this.userResultsSheetName];
        
        if (!userResultsSheet) {
            userResultsSheet = await doc.addSheet({ 
                title: this.userResultsSheetName,
                headerValues: ['betId', 'amount', 'status', 'earned', 'timestamp'] 
            });
        }
        
        return userResultsSheet;
    }
}