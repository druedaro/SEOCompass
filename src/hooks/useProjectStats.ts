import { useState, useEffect } from 'react';
import { getProjectAuditStats } from '@/services/contentAudit/contentAuditService';
import { getOpenTasksCount, getUserPendingTasksCount } from '@/services/task/taskService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { ProjectStats } from '@/types/stats';

export function useProjectStats(projectId: string | undefined, userId: string | undefined) {
  const [stats, setStats] = useState<ProjectStats>({
    pagesAudited: 0,
    openTasks: 0,
    myPendingTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchStats = async () => {
      await handleAsyncOperation(
        async () => {
          const [pagesAudited, openTasks, myPendingTasks] = await Promise.all([
            getProjectAuditStats(projectId),
            getOpenTasksCount(projectId),
            userId ? getUserPendingTasksCount(projectId, userId) : Promise.resolve(0),
          ]);

          setStats({ pagesAudited, openTasks, myPendingTasks });
        },
        {
          setLoading: setIsLoading,
          showSuccessToast: false,
          errorMessage: 'Error fetching project stats',
        }
      );
    };

    fetchStats();
  }, [projectId, userId]);

  return { stats, isLoading };
}
