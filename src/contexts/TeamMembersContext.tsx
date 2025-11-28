import { createContext, useState, useEffect, useCallback } from 'react';
import { getTeamMembers, removeTeamMember as removeTeamMemberService, leaveTeam as leaveTeamService } from '@/services/team/teamService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { Team, TeamMember } from '@/types/team';
import { useAuth } from '@/hooks/useAuth';

export interface TeamMembersContextType {
  teamMembers: TeamMember[];
  isLoadingMembers: boolean;
  membersError: string | null;
  currentUserMember: TeamMember | null;
  refreshMembers: () => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  leaveTeam: () => Promise<void>;
}

export const TeamMembersContext = createContext<TeamMembersContextType | undefined>(undefined);

interface TeamMembersProviderProps {
  children: React.ReactNode;
  currentTeam: Team | null;
  onTeamLeft?: () => void;
}

export function TeamMembersProvider({ children, currentTeam, onTeamLeft }: TeamMembersProviderProps) {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const currentUserMember = teamMembers.find(member => member.user_id === user?.id) || null;

  const refreshMembers = useCallback(async () => {
    if (!currentTeam) return;

    setMembersError(null);
    await handleAsyncOperation(
      async () => {
        const data = await getTeamMembers(currentTeam.id);
        setTeamMembers(data);
      },
      {
        setLoading: setIsLoadingMembers,
        showSuccessToast: false,
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load team members';
          setMembersError(errorMessage);
          setTeamMembers([]);
        }
      }
    );
  }, [currentTeam]);

  useEffect(() => {
    if (currentTeam) {
      refreshMembers();
    } else {
      setTeamMembers([]);
    }
  }, [currentTeam, refreshMembers]);

  const removeTeamMember = async (memberId: string) => {
    if (!currentTeam) throw new Error('No team selected');
    await removeTeamMemberService(currentTeam.id, memberId);
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const leaveTeam = async () => {
    if (!currentTeam) throw new Error('No team selected');
    await leaveTeamService(currentTeam.id);
    setTeamMembers([]);
    onTeamLeft?.();
  };

  const value: TeamMembersContextType = {
    teamMembers,
    isLoadingMembers,
    membersError,
    currentUserMember,
    refreshMembers,
    removeTeamMember,
    leaveTeam,
  };

  return (
    <TeamMembersContext.Provider value={value}>
      {children}
    </TeamMembersContext.Provider>
  );
}
