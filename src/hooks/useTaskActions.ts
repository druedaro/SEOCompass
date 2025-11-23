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
import { showErrorToast, showSuccessToast } from '@/lib/toast';

export function useTaskActions() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCreateTask = async (input: CreateTaskInput): Promise<Task> => {
    setIsCreating(true);
    try {
      const newTask = await createTask(input);
      showSuccessToast('Task created successfully');
      return newTask;
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to create task: ${err.message}`);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<CreateTaskInput>): Promise<Task> => {
    setIsUpdating(true);
    try {
      const updatedTask = await updateTask(taskId, updates);
      showSuccessToast('Task updated successfully');
      return updatedTask;
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to update task: ${err.message}`);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      showSuccessToast('Task deleted successfully');
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to delete task: ${err.message}`);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartTask = async (taskId: string): Promise<void> => {
    setIsStarting(true);
    try {
      await startTask(taskId);
      showSuccessToast('Task started');
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to start task: ${err.message}`);
      throw error;
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteTask = async (taskId: string): Promise<void> => {
    setIsCompleting(true);
    try {
      await completeTask(taskId);
      showSuccessToast('Task completed! 🎉');
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to complete task: ${err.message}`);
      throw error;
    } finally {
      setIsCompleting(false);
    }
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
