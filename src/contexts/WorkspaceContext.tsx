import { createContext } from 'react';
import type { WorkspaceContextType } from '@/types/context';
import { TeamProvider, TeamContext } from './TeamContext';
import { TeamMembersProvider } from './TeamMembersContext';
import { useContext } from 'react';

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <WorkspaceProviderInner>
        {children}
      </WorkspaceProviderInner>
    </TeamProvider>
  );
}

function WorkspaceProviderInner({ children }: { children: React.ReactNode }) {
  const teamContext = useContext(TeamContext);
  
  if (!teamContext) {
    throw new Error('WorkspaceProviderInner must be used within TeamProvider');
  }

  const { currentTeam, refreshTeams } = teamContext;

  const handleTeamLeft = async () => {
    await refreshTeams();
  };

  const value: WorkspaceContextType = {
    ...teamContext,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      <TeamMembersProvider currentTeam={currentTeam} onTeamLeft={handleTeamLeft}>
        {children}
      </TeamMembersProvider>
    </WorkspaceContext.Provider>
  );
}
