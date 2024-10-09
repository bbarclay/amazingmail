import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('AuthService', () => {
  let service: AuthService;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        resetPasswordForEmail: jest.fn(),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-value'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      mockSupabaseClient.auth.signUp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });

      const result = await service.register(registerDto);

      expect(result).toEqual({ user: { id: '123' } });
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException if registration fails', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      mockSupabaseClient.auth.signUp.mockResolvedValue({ data: null, error: { message: 'Registration failed' } });

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: '123' }, session: { access_token: 'token' } }, error: null });

      const result = await service.login(loginDto);

      expect(result).toEqual({ user: { id: '123' }, session: { access_token: 'token' } });
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(loginDto);
    });

    it('should throw BadRequestException if login fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Login failed' } });

      await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should send a password reset email successfully', async () => {
      const passwordResetDto = { email: 'test@example.com', newPassword: 'newpassword123' };
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

      await expect(service.resetPassword(passwordResetDto)).resolves.not.toThrow();
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw BadRequestException if password reset fails', async () => {
      const passwordResetDto = { email: 'test@example.com', newPassword: 'newpassword123' };
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ data: null, error: { message: 'Reset failed' } });

      await expect(service.resetPassword(passwordResetDto)).rejects.toThrow(BadRequestException);
    });
  });
});

