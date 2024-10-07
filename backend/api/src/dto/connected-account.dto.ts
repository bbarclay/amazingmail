
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ConnectedAccountDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    accountType: string;

    @IsOptional()
    accountDetails?: any; // You can specify a more detailed type if needed
}
