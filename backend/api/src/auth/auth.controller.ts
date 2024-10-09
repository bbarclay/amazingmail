import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('v1/auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return { message: 'User registered successfully', data };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login successful.' })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    if (!data) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { message: 'Login successful', data };
  }

  @Public()
  @Put('password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    await this.authService.resetPassword(passwordResetDto);
    return { message: 'Password reset email sent' };
  }
}

