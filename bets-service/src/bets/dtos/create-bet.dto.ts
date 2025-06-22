import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBetDto {
    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    outcomeId: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    amount: number;
}
