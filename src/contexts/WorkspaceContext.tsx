import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { teamService } from '@/services/teamService';
import type { Team, TeamMember } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';
import { showErrorToast } from '@/lib/toast';

interface WorkspaceContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  
  teams: Team[];
  isLoadingTeams: boolean;
  teamsError: string | null;
  refreshTeams: () => Promise<void>;
  
  teamMembers: TeamMember[];
  isLoadingMembers: boolean;
  membersError: string | null;
  refreshMembers: () => Promise<void>;
  currentUserMember: TeamMember | null;
  
  createTeam: (data: { name: string; description?: string; location?: string }) => Promise<Team>;
  updateTeam: (teamId: string, data: { name?: string; description?: string; location?: string }) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  isTeamOwner: () => Promise<boolean>;
  isOwner: boolean;
  switchTeam: (teamId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [membersError, setMembersError] = useState<string | null>(null);

  const currentUserMember = teamMembers.find(member => member.user_id === user?.id) || null;
  const isOwner = currentTeam?.user_id === user?.id;

  useEffect(() => {
    if (user) {
      refreshTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setTeamMembers([]);
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      refreshMembers();
    } else {
      setTeamMembers([]);
    }
  }, [currentTeam]);

  const refreshTeams = async () => {
    if (!user) return; 
    
    setIsLoadingTeams(true);
    setTeamsError(null);
    try {
      const data = await teamService.getUserTeams();
      setTeams(data);
      
      if (!currentTeam && data.length > 0) {
        setCurrentTeam(data[0]);
      }
      
      if (currentTeam && !data.find(t => t.id === currentTeam.id)) {
        setCurrentTeam(data.length > 0 ? data[0] : null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load teams';
      setTeamsError(errorMessage);
      showErrorToast('Failed to load teams', errorMessage);
      setTeams([]);
      setCurrentTeam(null);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const refreshMembers = async () => {
    if (!currentTeam) return;
    
    setIsLoadingMembers(true);
    setMembersError(null);
    try {
      const data = await teamService.getTeamMembers(currentTeam.id);
      setTeamMembers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load team members';
      setMembersError(errorMessage);
      showErrorToast('Failed to load members', errorMessage);
      setTeamMembers([]);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const createTeam = async (data: { name: string; description?: string; location?: string }) => {
    const newTeam = await teamService.createTeam(data);
    setTeams((prev) => [newTeam, ...prev]);
    setCurrentTeam(newTeam);
    return newTeam;
  };

  const updateTeam = async (teamId: string, data: { name?: string; description?: string; location?: string }) => {
    const updatedTeam = await teamService.updateTeam(teamId, data);
    setTeams((prev) => prev.map((t) => (t.id === teamId ? updatedTeam : t)));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(updatedTeam);
    }
    return updatedTeam;
  };

  const deleteTeam = async (teamId: string) => {
    await teamService.deleteTeam(teamId);
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    if (currentTeam?.id === teamId) {
      const remainingTeams = teams.filter((t) => t.id !== teamId);
      setCurrentTeam(remainingTeams.length > 0 ? remainingTeams[0] : null);
    }
  };

  const removeTeamMember = async (memberId: string) => {
    if (!currentTeam) throw new Error('No team selected');
    await teamService.removeTeamMember(currentTeam.id, memberId);
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const isTeamOwner = async (): Promise<boolean> => {
    if (!currentTeam) return false;
    return await teamService.isTeamOwner(currentTeam.id);
  };

  const switchTeam = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
    }
  };

  const value: WorkspaceContextType = {
    currentTeam,
    setCurrentTeam,
    teams,
    isLoadingTeams,
    teamsError,
    refreshTeams,
    teamMembers,
    isLoadingMembers,
    membersError,
    refreshMembers,
    currentUserMember,
    createTeam,
    updateTeam,
    deleteTeam,
    removeTeamMember,
    isTeamOwner,
    isOwner,
    switchTeam,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
