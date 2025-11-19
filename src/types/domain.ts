// Re-export all types for backward compatibility
export type { UserRole, Profile } from './user';
export type { Team, TeamMember } from './team';
export type { Project } from './project';
export type { Task, TaskPriority, TaskStatus, CreateTaskInput, UpdateTaskInput, TaskFilters, PaginatedTasksResponse } from './task';
export type { ProjectUrl, CreateProjectUrlInput } from './projectUrl';
export type { ScrapedContent, ScrapeOptions, AuditHistoryEntry } from './audit';
export type {
  ParsedMetadata,
  ParsedHeading,
  ParsedImage,
  ParsedLink,
  ParsedContent,
  ValidationResult,
  SEOScoreBreakdown,
  ScoreCalculationInput,
  Recommendation
} from './seoTypes';
export type { AuthContextType, AuthProviderProps, WorkspaceContextType, ProjectContextType } from './context';
export type { ScrapingSeoResponse } from './edgeFunction';
export type { ValidationResults } from './hooks';
export type {
  DeleteConfirmationDialogProps,
  EmptyStateProps,
  FormFieldContextValue,
  LocationAutocompleteProps,
  PaginationProps,
  PriorityBadgeProps,
  ProjectCardProps,
  AuditHistoryChartProps,
  AuditResultsTableProps,
  CreateTaskModalProps,
  CreateTeamDialogProps,
  DashboardLayoutProps,
  ProjectModalProps,
  ProjectUrlsListProps,
  RoleSelectionModalProps,
  TaskFiltersProps,
  TaskListProps,
  TeamSelectorProps
} from './componentTypes';
