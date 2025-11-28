import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from './user';
import type { Team } from './team';
import type { Project } from './project';
import type { ReactNode } from 'react';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface WorkspaceContextType {
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

export interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, description?: string, domain?: string) => Promise<Project>;
  updateProject: (projectId: string, updates: { name?: string; description?: string; domain?: string }) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
}
