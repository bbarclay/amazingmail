import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class BaseUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
