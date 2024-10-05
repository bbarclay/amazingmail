import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
// import { sanitize } from 'class-sanitizer';

export class PasswordResetDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
