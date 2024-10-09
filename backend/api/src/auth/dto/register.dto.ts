import { BaseUserDto } from '../../common/dto/base-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto extends BaseUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
