import { createContextHook } from '@/lib/contextFactory';
import { WorkspaceContext } from '@/contexts/WorkspaceContext';

export const useWorkspace = createContextHook(WorkspaceContext, 'useWorkspace', 'WorkspaceProvider');
