
import { IsNotEmpty } from 'class-validator';

export class UpdateDomainDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    name: string;
}
