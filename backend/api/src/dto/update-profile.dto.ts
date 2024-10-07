
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;
}
