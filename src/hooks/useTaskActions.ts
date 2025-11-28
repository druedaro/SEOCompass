import { useState } from 'react';
import {
  createTask,
  updateTask,
  deleteTask,
  startTask,
  completeTask,
  type CreateTaskInput,
  type Task,
} from '@/services/task/taskService';
import { handleAsyncOperation } from '@/lib/asyncHandler';

export function useTaskActions() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCreateTask = async (input: CreateTaskInput): Promise<Task | undefined> => {
    let result: Task | undefined;
    await handleAsyncOperation(
      async () => {
        result = await createTask(input);
        return result;
      },
      {
        setLoading: setIsCreating,
        showSuccessToast: false,
        errorMessage: 'Failed to create task',
      }
    );
    return result;
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<CreateTaskInput>): Promise<Task | undefined> => {
    let result: Task | undefined;
    await handleAsyncOperation(
      async () => {
        result = await updateTask(taskId, updates);
        return result;
      },
      {
        setLoading: setIsUpdating,
        showSuccessToast: false,
        errorMessage: 'Failed to update task',
      }
    );
    return result;
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    await handleAsyncOperation(
      () => deleteTask(taskId),
      {
        setLoading: setIsDeleting,
        showSuccessToast: false,
        errorMessage: 'Failed to delete task',
      }
    );
  };

  const handleStartTask = async (taskId: string): Promise<void> => {
    await handleAsyncOperation(
      () => startTask(taskId),
      {
        setLoading: setIsStarting,
        successMessage: 'Task started',
        errorMessage: 'Failed to start task',
      }
    );
  };

  const handleCompleteTask = async (taskId: string): Promise<void> => {
    await handleAsyncOperation(
      () => completeTask(taskId),
      {
        setLoading: setIsCompleting,
        successMessage: 'Task completed! 🎉',
        errorMessage: 'Failed to complete task',
      }
    );
  };

  return {
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    startTask: handleStartTask,
    completeTask: handleCompleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    isStarting,
    isCompleting,
  };
}
