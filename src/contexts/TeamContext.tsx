import { createContext, useState, useEffect, useCallback } from 'react';
import { getUserTeams, createTeam as createTeamService, updateTeam as updateTeamService, deleteTeam as deleteTeamService } from '@/services/team/teamService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { Team } from '@/types/team';
import { useAuth } from '@/hooks/useAuth';

export interface TeamContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  teams: Team[];
  isLoadingTeams: boolean;
  teamsError: string | null;
  isOwner: boolean;
  refreshTeams: () => Promise<void>;
  createTeam: (data: { name: string; description?: string; location?: string }) => Promise<Team>;
  updateTeam: (teamId: string, data: { name?: string; description?: string; location?: string }) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  switchTeam: (teamId: string) => Promise<void>;
}

export const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  const isOwner = currentTeam?.user_id === user?.id;

  const refreshTeams = useCallback(async () => {
    if (!user) return;

    setTeamsError(null);
    await handleAsyncOperation(
      async () => {
        const data = await getUserTeams();
        setTeams(data);

        if (!currentTeam && data.length > 0) {
          setCurrentTeam(data[0]);
        }

        if (currentTeam && !data.find(t => t.id === currentTeam.id)) {
          setCurrentTeam(data.length > 0 ? data[0] : null);
        }
      },
      {
        setLoading: setIsLoadingTeams,
        showSuccessToast: false,
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load teams';
          setTeamsError(errorMessage);
          setTeams([]);
          setCurrentTeam(null);
        }
      }
    );
  }, [user, currentTeam]);

  useEffect(() => {
    if (user) {
      refreshTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
    }
  }, [user, refreshTeams]);

  const createTeam = async (data: { name: string; description?: string; location?: string }) => {
    const newTeam = await createTeamService(data);
    setTeams((prev) => [newTeam, ...prev]);
    setCurrentTeam(newTeam);
    return newTeam;
  };

  const updateTeam = async (teamId: string, data: { name?: string; description?: string; location?: string }) => {
    const updatedTeam = await updateTeamService(teamId, data);
    setTeams((prev) => prev.map((t) => (t.id === teamId ? updatedTeam : t)));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(updatedTeam);
    }
    return updatedTeam;
  };

  const deleteTeam = async (teamId: string) => {
    await deleteTeamService(teamId);
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    if (currentTeam?.id === teamId) {
      const remainingTeams = teams.filter((t) => t.id !== teamId);
      setCurrentTeam(remainingTeams.length > 0 ? remainingTeams[0] : null);
    }
  };

  const switchTeam = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
    }
  };

  const value: TeamContextType = {
    currentTeam,
    setCurrentTeam,
    teams,
    isLoadingTeams,
    teamsError,
    isOwner,
    refreshTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    switchTeam,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
}
