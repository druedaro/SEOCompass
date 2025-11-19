import { useState, useEffect } from 'react';
import { Task, TaskFilters as TaskFiltersType, getTasksByProject } from '@/services/task/taskService';
import { showErrorToast } from '@/lib/toast';

export function useTasks(projectId?: string, filters: TaskFiltersType = {}, page: number = 1) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = () => {
    if (!projectId) {
      setTasks([]);
      setTotalTasks(0);
      setTotalPages(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getTasksByProject(projectId, filters, page)
      .then((response) => {
        setTasks(response.tasks);
        setTotalTasks(response.total);
        setTotalPages(response.totalPages);
      })
      .catch(() => {
        showErrorToast('Failed to load tasks. Please try again.');
        setTasks([]);
        setTotalTasks(0);
        setTotalPages(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();

  }, [projectId, filters, page]);

  return { tasks, totalTasks, totalPages, isLoading, reload: fetchTasks };
}
