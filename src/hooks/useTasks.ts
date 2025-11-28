import { useState, useEffect } from 'react';
import { Task, TaskFilters as TaskFiltersType, getTasksByProject } from '@/services/task/taskService';
import { handleAsyncOperation } from '@/lib/asyncHandler';

export function useTasks(projectId?: string, filters: TaskFiltersType = {}, page: number = 1) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    if (!projectId) {
      setTasks([]);
      setTotalTasks(0);
      setTotalPages(0);
      setIsLoading(false);
      return;
    }

    await handleAsyncOperation(
      async () => {
        const response = await getTasksByProject(projectId, filters, page);
        setTasks(response.tasks);
        setTotalTasks(response.total);
        setTotalPages(response.totalPages);
      },
      {
        setLoading: setIsLoading,
        errorMessage: 'Failed to load tasks',
        showSuccessToast: false,
        onError: () => {
          setTasks([]);
          setTotalTasks(0);
          setTotalPages(0);
        },
      }
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, filters, page]);

  return { tasks, totalTasks, totalPages, isLoading, reload: fetchTasks };
}
