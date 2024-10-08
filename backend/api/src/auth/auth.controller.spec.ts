import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const mockUser: Partial<User> = { id: 1, email: registerDto.email };
      jest.spyOn(authService, 'register').mockResolvedValue(mockUser as User);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        message: 'User registered successfully',
        user: mockUser,
      });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockToken = 'mock.jwt.token';
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        access_token: mockToken,
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      const passwordResetDto: PasswordResetDto = {
        email: 'test@example.com',
        newPassword: 'newpassword123',
      };
      jest.spyOn(authService, 'resetPassword').mockResolvedValue(undefined);

      const result = await controller.resetPassword(passwordResetDto);

      expect(result).toEqual({ message: 'Password reset successful' });
      expect(authService.resetPassword).toHaveBeenCalledWith(passwordResetDto);
    });
  });
});

