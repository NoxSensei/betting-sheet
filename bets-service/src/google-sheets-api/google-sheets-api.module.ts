import { Module } from '@nestjs/common';
import { GoogleSheetsApiService } from './services/google-sheets-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [GoogleSheetsApiService],
    exports: [GoogleSheetsApiService]
})
export class GoogleSheetsApiModule {}