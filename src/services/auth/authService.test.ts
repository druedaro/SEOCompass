import { describe, it, expect, beforeEach } from 'vitest';
import { signUp, signIn, signOut, getSession, getCurrentUser, signInWithGoogle, resetPassword, updatePassword } from './authService';
import type { LoginFormData, RegisterFormData } from '@/schemas/authSchema';
import {
  mockSupabaseAuth,
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createErrorResponse,
  createQueryBuilder,
} from '@/__mocks__/supabase';

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

      const result = await signUp(registerData);

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

      const result = await signIn(loginData);

      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: loginData.email,
        password: loginData.password,
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('should sign out current user successfully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue(createSuccessResponse({}));

      await expect(signOut()).resolves.not.toThrow();
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });
  });
});
