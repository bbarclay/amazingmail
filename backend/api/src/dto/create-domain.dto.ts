
import { IsNotEmpty } from 'class-validator';

export class CreateDomainDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    userId: string;
}
