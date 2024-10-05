
import { IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    plan: string;

    @IsNotEmpty()
    status: string;
}
