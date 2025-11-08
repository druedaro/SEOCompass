import { useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';
import { authService } from '@/services/authService';
import type { Profile, UserRole } from '@/types/domain';
import { AuthContext } from './AuthContext';
import { RoleSelectionModal } from '@/components/organisms/RoleSelectionModal';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const isFetchingProfileRef = useRef(false);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    if (isFetchingProfileRef.current) {
      return;
    }
    
    try {
      isFetchingProfileRef.current = true;
      
      // First, try to get the profile (use maybeSingle to avoid 406 error)
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // If profile doesn't exist (OAuth user), create it
      if (!profileData && !error) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: userId,
              email: user.email || '',
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            setProfile(null);
          } else {
            setProfile(newProfile);
            // Show role modal for OAuth users
            setShowRoleModal(true);
          }
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(profileData);
        
        // Check if profile exists but has no role (OAuth user)
        if (profileData && !profileData.role) {
          setShowRoleModal(true);
        }
      }
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

  // Handle role selection for OAuth users
  const handleRoleSelection = async (role: UserRole, fullName: string) => {
    if (!user) return;
    
    try {
      // Update both role and full_name
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          full_name: fullName,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh profile to get updated data
      await fetchProfile(user.id);
      setShowRoleModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showRoleModal && <RoleSelectionModal onSelectRole={handleRoleSelection} />}
    </AuthContext.Provider>
  );
}
