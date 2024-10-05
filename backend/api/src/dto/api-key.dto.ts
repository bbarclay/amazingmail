
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ApiKeyDto {
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    description?: string;
}
