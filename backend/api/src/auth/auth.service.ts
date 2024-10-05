import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetDto } from './dto/password-reset.dto';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const sanitizedDto = plainToClass(RegisterDto, registerDto);
    sanitize(sanitizedDto);
    const { email, password } = sanitizedDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<string | null> {
    const sanitizedDto = plainToClass(LoginDto, loginDto);
    sanitize(sanitizedDto);
    const { email, password } = sanitizedDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload);
    }
    return null;
  }

  async resetPassword(passwordResetDto: PasswordResetDto): Promise<void> {
    const sanitizedDto = plainToClass(PasswordResetDto, passwordResetDto);
    sanitize(sanitizedDto);
    const { email, newPassword } = sanitizedDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await this.usersRepository.save(user);
    } else {
      throw new BadRequestException('User not found');
    }
  }
}
