import { createContextHook } from '@/lib/contextFactory';
import { TeamContext } from '@/contexts/TeamContext';

export const useTeam = createContextHook(TeamContext, 'useTeam', 'TeamProvider');
