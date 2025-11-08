import { supabase } from '@/config/supabase';
import type { LoginFormData, RegisterFormData } from '@/schemas/authSchema';
import type { UserRole } from '@/types/domain';

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Sign up with email and password
   */
  async signUp(data: RegisterFormData) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            full_name: data.fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create profile manually (trigger might not work consistently)
      // First, check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', authData.user.id)
        .single();

      if (!existingProfile) {
        // Profile doesn't exist, create it
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ 
            user_id: authData.user.id,
            email: data.email,
            role: data.role as UserRole,
            full_name: data.fullName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      } else {
        // Profile exists, update it
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: data.role as UserRole,
            full_name: data.fullName,
          })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(data: LoginFormData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Get user profile with role
   */
  async getUserProfile(userId: string) {
    try {
      // Create a timeout promise (10s timeout)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });
      
      // Race between the query and timeout
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      const result = await Promise.race([queryPromise, timeoutPromise]);
      
      if ('error' in result && result.error) {
        throw result.error;
      }
      
      if ('data' in result) {
        return result.data;
      }
      
      throw new Error('Unexpected response from database');
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  },
};
