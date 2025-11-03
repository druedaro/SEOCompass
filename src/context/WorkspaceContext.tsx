import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { teamService } from '@/services/teamService';
import type { Team, TeamMember, Invitation } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';

interface WorkspaceContextType {
  // Current team
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  
  // Teams
  teams: Team[];
  isLoadingTeams: boolean;
  refreshTeams: () => Promise<void>;
  
  // Team members
  teamMembers: TeamMember[];
  isLoadingMembers: boolean;
  refreshMembers: () => Promise<void>;
  
  // Invitations
  invitations: Invitation[];
  isLoadingInvitations: boolean;
  refreshInvitations: () => Promise<void>;
  
  // Actions
  createTeam: (data: { name: string; description?: string; location?: string }) => Promise<Team>;
  updateTeam: (teamId: string, data: { name?: string; description?: string; location?: string }) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  switchTeam: (teamId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);

  // Load teams when user is authenticated
  useEffect(() => {
    if (user) {
      refreshTeams();
    } else {
      // Clear data when user logs out
      setTeams([]);
      setCurrentTeam(null);
      setTeamMembers([]);
      setInvitations([]);
    }
  }, [user]);

  // Load team members when current team changes
  useEffect(() => {
    if (currentTeam) {
      refreshMembers();
      refreshInvitations();
    } else {
      setTeamMembers([]);
      setInvitations([]);
    }
  }, [currentTeam]);

  const refreshTeams = async () => {
    if (!user) return; // Don't try to load teams if user is not authenticated
    
    setIsLoadingTeams(true);
    try {
      const data = await teamService.getUserTeams();
      setTeams(data);
      
      // If no current team and teams exist, set first team as current
      if (!currentTeam && data.length > 0) {
        setCurrentTeam(data[0]);
      }
      
      // If current team was deleted, update to first available team
      if (currentTeam && !data.find(t => t.id === currentTeam.id)) {
        setCurrentTeam(data.length > 0 ? data[0] : null);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      // Silently fail - user might not have teams yet or tables might not be set up
      setTeams([]);
      setCurrentTeam(null);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const refreshMembers = async () => {
    if (!currentTeam) return;
    
    setIsLoadingMembers(true);
    try {
      const data = await teamService.getTeamMembers(currentTeam.id);
      setTeamMembers(data);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const refreshInvitations = async () => {
    if (!currentTeam) return;
    
    setIsLoadingInvitations(true);
    try {
      const data = await teamService.getTeamInvitations(currentTeam.id);
      setInvitations(data);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const createTeam = async (data: { name: string; description?: string; location?: string }) => {
    const newTeam = await teamService.createTeam(data);
    await refreshTeams();
    setCurrentTeam(newTeam);
    return newTeam;
  };

  const updateTeam = async (teamId: string, data: { name?: string; description?: string; location?: string }) => {
    const updatedTeam = await teamService.updateTeam(teamId, data);
    await refreshTeams();
    if (currentTeam?.id === teamId) {
      setCurrentTeam(updatedTeam);
    }
    return updatedTeam;
  };

  const deleteTeam = async (teamId: string) => {
    await teamService.deleteTeam(teamId);
    await refreshTeams();
    if (currentTeam?.id === teamId) {
      setCurrentTeam(teams.length > 1 ? teams.find(t => t.id !== teamId) || null : null);
    }
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
    refreshTeams,
    teamMembers,
    isLoadingMembers,
    refreshMembers,
    invitations,
    isLoadingInvitations,
    refreshInvitations,
    createTeam,
    updateTeam,
    deleteTeam,
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
