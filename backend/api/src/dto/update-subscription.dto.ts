
import { IsNotEmpty } from 'class-validator';

export class UpdateSubscriptionDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    plan: string;

    @IsNotEmpty()
    status: string;
}
