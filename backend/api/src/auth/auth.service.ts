import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY')
    );
  }

async register(registerDto: RegisterDto): Promise<any> {
    const sanitizedDto = plainToClass(RegisterDto, registerDto);
    sanitize(sanitizedDto);
    const { email, password, firstName, lastName } = sanitizedDto;

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Create a profile in the 'users' table
    if (data.user) {
      const { error: profileError } = await this.supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
          },
        ]);

      if (profileError) {
        throw new BadRequestException(profileError.message);
      }
    }

    return data;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const sanitizedDto = plainToClass(LoginDto, loginDto);
    sanitize(sanitizedDto);
    const { email, password } = sanitizedDto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async resetPassword(passwordResetDto: PasswordResetDto): Promise<void> {
    const sanitizedDto = plainToClass(PasswordResetDto, passwordResetDto);
    sanitize(sanitizedDto);
    const { email } = sanitizedDto;

    const { error } = await this.supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new BadRequestException(error.message);
    }
  }
}

