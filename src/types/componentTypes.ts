import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import type { Task, TaskFilters, TaskPriority } from './task';
import type { Project } from './project';
import type { ProjectUrl } from './projectUrl';
import type { Recommendation } from './seoTypes';

import { badgeVariants } from '@/components/atoms/Badge';
import { buttonVariants } from '@/components/atoms/Button';
import type { VariantProps } from 'class-variance-authority';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export interface AvatarProps {
  children: ReactNode;
  className?: string;
}

export interface LocationAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export interface ProjectCardProps {
  project: Project;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export interface RoleSelectionModalProps {
  onSelectRole: (role: import('./user').UserRole, fullName: string) => Promise<void>;
}

export interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export interface AuditHistoryChartProps {
  projectUrlId: string;
  urlLabel: string;
}

export interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface DashboardLayoutProps {
  children: ReactNode;
}

export interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onTaskCreated: () => void;
  auditReference?: string;
  initialTitle?: string;
  initialDescription?: string;
  taskToEdit?: Task | null;
}

export interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  mode?: 'create' | 'edit';
}

export interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskEdit: (task: Task) => void;
}

export interface AuditResultsTableProps {
  recommendations: Recommendation[];
  overallScore: number;
  categoryScores: {
    meta: number;
    content: number;
    technical: number;
    onPage: number;
  };
  onAddTask?: (recommendation: Recommendation) => void;
  urlLabel?: string;
}

export interface TeamSelectorProps {
  onCreateTeam?: () => void;
}

export interface ProjectUrlsListProps {
  urls: ProjectUrl[];
  onAudit: (urlId: string) => void;
  isAuditing?: boolean;
  currentAuditingUrlId?: string;
}

export interface LocationPickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface AddProjectUrlFormProps {
  onAdd: (url: string, label: string) => Promise<boolean | void>;
  isAdding: boolean;
  currentCount: number;
  maxCount: number;
}

export interface ProjectUrlsTableProps {
  urls: ProjectUrl[];
  onDelete: (id: string) => void;
}

export interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDateSelect?: (start: Date, end: Date) => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}
