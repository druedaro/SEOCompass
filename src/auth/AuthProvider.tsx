import { useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';
import { authService } from '@/services/authService';
import type { Profile } from '@/types/domain';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isFetchingProfileRef = useRef(false);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    if (isFetchingProfileRef.current) {
      return;
    }
    
    try {
      isFetchingProfileRef.current = true;
      const profileData = await authService.getUserProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      isFetchingProfileRef.current = false;
    }
  }, []);

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session first
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't await - load profile in background
          fetchProfile(session.user.id).catch(() => {
            // Profile fetch failed, but user can continue
          });
        }
        
        // Set loading to false immediately - don't wait for profile
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip INITIAL_SESSION event since we already handled it above
      if (event === 'INITIAL_SESSION') {
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        // Don't await - load profile in background
        fetchProfile(session.user.id).catch(() => {
          // Profile fetch failed, but user can continue
        });
      } else if (!session?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign out handler
  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
