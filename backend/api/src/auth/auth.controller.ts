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
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
// import { Throttle } from '@nestjs/throttler';

@Controller('v1/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // @Throttle(5, 60) // Throttling: 5 requests per 60 seconds
  @HttpCode(HttpStatus.CREATED) // Returns 201 status code
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  // @Throttle(10, 60) // Throttling: 10 requests per 60 seconds
  @HttpCode(HttpStatus.OK) // Returns 200 status code
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { message: 'Login successful', access_token: token };
  }

  @Put('password-reset')
  @HttpCode(HttpStatus.OK) // Returns 200 status code
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    await this.authService.resetPassword(passwordResetDto);
    return { message: 'Password reset successful' };
  }
}
