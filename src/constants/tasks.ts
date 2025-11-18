import type { TaskPriority, TaskStatus } from '@/services/task';

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    variant: 'secondary' | 'default' | 'destructive';
    className: string;
  }
> = {
  low: {
    label: 'Low',
    variant: 'secondary',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  medium: {
    label: 'Medium',
    variant: 'default',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  high: {
    label: 'High',
    variant: 'default',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
  urgent: {
    label: 'Urgent',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
};

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  todo: { label: 'To Do', className: 'bg-gray-100 text-gray-800' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
};

export const TASKS_PER_PAGE = 15;
