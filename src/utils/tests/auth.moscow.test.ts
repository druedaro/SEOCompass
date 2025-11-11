import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '@/services/authService';
import type { LoginFormData, RegisterFormData } from '@/schemas/authSchema';
import {
  mockSupabaseAuth,
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createErrorResponse,
  createQueryBuilder,
} from './__mocks__/supabaseMock';

describe('Authentication Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });
  
  describe('MUST HAVE: Core Authentication', () => {
    it('should register a new user with email and password', async () => {
      const registerData: RegisterFormData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'tech_seo',
        fullName: 'Test User',
      };

      const mockUser = { id: '123', email: registerData.email };
      const mockSession = { access_token: 'token123' };
      
      mockSupabaseAuth.signUp.mockResolvedValue(
        createSuccessResponse({ user: mockUser, session: mockSession })
      );

      const profileCheckBuilder = createQueryBuilder();
      profileCheckBuilder.single.mockResolvedValue(
        createSuccessResponse(null)
      );
      
      const profileInsertBuilder = createQueryBuilder();
      profileInsertBuilder.single.mockResolvedValue(
        createSuccessResponse({ user_id: '123', email: registerData.email, role: registerData.role })
      );
      
      mockSupabaseFrom
        .mockReturnValueOnce(profileCheckBuilder)
        .mockReturnValueOnce(profileInsertBuilder);

      const result = await authService.signUp(registerData);

      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            role: registerData.role,
            full_name: registerData.fullName,
          },
        },
      });
      expect(result.user).toEqual(mockUser);
    });

    it('should handle registration errors', async () => {
      const registerData: RegisterFormData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'tech_seo',
        fullName: 'Test User',
      };

      mockSupabaseAuth.signUp.mockResolvedValue(
        createErrorResponse('Email already registered', 'USER_ALREADY_EXISTS')
      );

      await expect(authService.signUp(registerData)).rejects.toThrow();
      expect(mockSupabaseAuth.signUp).toHaveBeenCalled();
    });

    it('should login user with valid credentials', async () => {
      const loginData: LoginFormData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockUser = { id: '123', email: loginData.email };
      const mockSession = { access_token: 'token123' };

      mockSupabaseAuth.signInWithPassword.mockResolvedValue(
        createSuccessResponse({ user: mockUser, session: mockSession })
      );

      const result = await authService.signIn(loginData);

      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: loginData.email,
        password: loginData.password,
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('should handle invalid login credentials', async () => {
      const loginData: LoginFormData = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockSupabaseAuth.signInWithPassword.mockResolvedValue(
        createErrorResponse('Invalid login credentials', 'INVALID_CREDENTIALS')
      );

      await expect(authService.signIn(loginData)).rejects.toThrow();
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalled();
    });

    it('should sign out current user successfully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue(createSuccessResponse({}));

      await expect(authService.signOut()).resolves.not.toThrow();
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });

    it('should get current session', async () => {
      const mockSession = { access_token: 'token123', user: { id: '123' } };

      mockSupabaseAuth.getSession.mockResolvedValue(
        createSuccessResponse({ session: mockSession })
      );

      const result = await authService.getSession();

      expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });

    it('should get current user', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };

      mockSupabaseAuth.getUser.mockResolvedValue(
        createSuccessResponse({ user: mockUser })
      );

      const result = await authService.getCurrentUser();

      expect(mockSupabaseAuth.getUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('SHOULD HAVE: OAuth Authentication', () => {
    it('should initiate Google OAuth sign in', async () => {
      mockSupabaseAuth.signInWithOAuth.mockResolvedValue(
        createSuccessResponse({ provider: 'google', url: 'https://oauth.url' })
      );

      const result = await authService.signInWithGoogle();

      expect(mockSupabaseAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      });
      expect(result.provider).toBe('google');
    });
  });

  describe('COULD HAVE: Password Management', () => {
    it('should send password reset email', async () => {
      const email = 'test@example.com';

      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue(
        createSuccessResponse({})
      );

      await expect(authService.resetPassword(email)).resolves.not.toThrow();

      expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        email,
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/reset-password'),
        })
      );
    });

    it('should update user password', async () => {
      const newPassword = 'NewPassword123!';

      mockSupabaseAuth.updateUser.mockResolvedValue(
        createSuccessResponse({ user: { id: '123' } })
      );

      await expect(authService.updatePassword(newPassword)).resolves.not.toThrow();

      expect(mockSupabaseAuth.updateUser).toHaveBeenCalledWith({
        password: newPassword,
      });
    });
  });
});
