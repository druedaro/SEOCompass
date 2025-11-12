import { supabase } from '@/config/supabase';
import type { LoginFormData, RegisterFormData } from '@/schemas/authSchema';
import type { UserRole } from '@/types/domain';

export const authService = {
  async signUp(data: RegisterFormData) {
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

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
          user_id: authData.user.id,
          email: data.email,
          role: data.role as UserRole,
          full_name: data.fullName,
        });

      if (profileError) throw profileError;
    } else {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: data.role as UserRole,
          full_name: data.fullName,
        })
        .eq('user_id', authData.user.id);

      if (profileError) throw profileError;
    }

    return { user: authData.user, session: authData.session };
  },

  async signIn(data: LoginFormData) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return { user: authData.user, session: authData.session };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },
};
