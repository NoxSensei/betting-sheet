import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { BetsApiService } from "./services/bets-api.service";

@Module({
    imports: [HttpModule],
    providers: [BetsApiService],
    exports: [BetsApiService],
})
export class BetsApiModule {}