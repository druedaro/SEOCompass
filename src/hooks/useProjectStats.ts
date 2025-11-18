import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

interface ProjectStats {
  pagesAudited: number;
  openTasks: number;
  myPendingTasks: number;
}

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
      setIsLoading(true);

      try {
        const [auditsResult, tasksResult, myTasksResult] = await Promise.all([
          supabase
            .from('content_audits')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId),
          
          supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId)
            .neq('status', 'completed')
            .neq('status', 'cancelled'),
          
          userId
            ? supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', projectId)
                .eq('assigned_to', userId)
                .in('status', ['todo', 'in_progress'])
            : Promise.resolve({ count: 0 }),
        ]);

        setStats({
          pagesAudited: auditsResult.count || 0,
          openTasks: tasksResult.count || 0,
          myPendingTasks: myTasksResult.count || 0,
        });
      } catch (error) {
        console.error('Error fetching project stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [projectId, userId]);

  return { stats, isLoading };
}
