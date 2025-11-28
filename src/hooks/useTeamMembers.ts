import { createContextHook } from '@/lib/contextFactory';
import { TeamMembersContext } from '@/contexts/TeamMembersContext';

export const useTeamMembers = createContextHook(TeamMembersContext, 'useTeamMembers', 'TeamMembersProvider');
