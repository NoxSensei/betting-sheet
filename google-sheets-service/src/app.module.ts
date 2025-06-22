import { Module } from '@nestjs/common';
import { SheetsModule } from './sheets/sheets.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }), 
  SheetsModule
],
})
export class AppModule {}
