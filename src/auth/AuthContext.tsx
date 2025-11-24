import { createContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';
import { signOut, getOrCreateProfile, updateUserProfile } from '@/services/auth/authService';
import type { Profile, UserRole } from '@/types/user';
import type { AuthContextType, AuthProviderProps } from '@/types/context';
import { RoleSelectionModal } from '@/components/organisms/RoleSelectionModal';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const isFetchingProfileRef = useRef(false);

  const fetchProfile = async (userId: string) => {
    if (isFetchingProfileRef.current) {
      return;
    }

    try {
      isFetchingProfileRef.current = true;

      const { data: { user } } = await supabase.auth.getUser();
      const profileData = await getOrCreateProfile(userId, user?.email || '');

      setProfile(profileData);

      if (profileData && !profileData.role) {
        setShowRoleModal(true);
      }
    } catch {
      setProfile(null);
    } finally {
      isFetchingProfileRef.current = false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(session.user.id).catch(() => { });
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user && event === 'SIGNED_IN') {
        fetchProfile(session.user.id).catch(() => { });
      } else if (!session?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const handleRoleSelection = async (role: UserRole, fullName: string) => {
    if (!user) return;

    await updateUserProfile(user.id, { role, full_name: fullName });
    await fetchProfile(user.id);
    setShowRoleModal(false);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showRoleModal && <RoleSelectionModal onSelectRole={handleRoleSelection} />}
    </AuthContext.Provider>
  );
}
