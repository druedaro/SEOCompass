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
    // Reset all mocks before each test
    resetSupabaseMocks();
  });

  // ==========================================
  // MUST HAVE - Critical functionality (6 tests)
  // ==========================================
  
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

      // Mock the profile check (returns null = profile doesn't exist)
      const profileCheckBuilder = createQueryBuilder();
      profileCheckBuilder.single.mockResolvedValue(
        createSuccessResponse(null)
      );
      
      // Mock the profile insert
      const profileInsertBuilder = createQueryBuilder();
      profileInsertBuilder.single.mockResolvedValue(
        createSuccessResponse({ user_id: '123', email: registerData.email, role: registerData.role })
      );
      
      // First call is for checking, second is for inserting
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

    it('should handle sign out errors', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue(
        createErrorResponse('Sign out failed', 'SIGN_OUT_ERROR')
      );

      await expect(authService.signOut()).rejects.toThrow();
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

    it('should handle session retrieval errors', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue(
        createErrorResponse('Session expired', 'SESSION_EXPIRED')
      );

      await expect(authService.getSession()).rejects.toThrow();
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

    it('should handle get user errors', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue(
        createErrorResponse('User not found', 'USER_NOT_FOUND')
      );

      await expect(authService.getCurrentUser()).rejects.toThrow();
    });
  });

  // ==========================================
  // SHOULD HAVE - Important but not critical (2 tests)
  // ==========================================

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

    it('should handle OAuth authentication errors', async () => {
      mockSupabaseAuth.signInWithOAuth.mockResolvedValue(
        createErrorResponse('OAuth provider unavailable', 'OAUTH_ERROR')
      );

      await expect(authService.signInWithGoogle()).rejects.toThrow();
      expect(mockSupabaseAuth.signInWithOAuth).toHaveBeenCalled();
    });
  });

  // ==========================================
  // COULD HAVE - Nice to have features (2 tests)
  // ==========================================

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

    it('should handle password reset errors', async () => {
      const email = 'nonexistent@example.com';

      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue(
        createErrorResponse('User not found', 'USER_NOT_FOUND')
      );

      await expect(authService.resetPassword(email)).rejects.toThrow();
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

    it('should handle password update errors', async () => {
      const newPassword = 'NewPassword123!';

      mockSupabaseAuth.updateUser.mockResolvedValue(
        createErrorResponse('Password update failed', 'UPDATE_ERROR')
      );

      await expect(authService.updatePassword(newPassword)).rejects.toThrow();
    });
  });

  // ==========================================
  // WON'T HAVE - Out of scope for MVP (0 tests)
  // ==========================================
  // - Multi-factor authentication
  // - Email verification reminders
  // - Account deletion
});
