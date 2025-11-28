import { createContextHook } from '@/lib/contextFactory';
import { ProjectContext } from '@/contexts/ProjectContext';

export const useProject = createContextHook(ProjectContext, 'useProject', 'ProjectProvider');
