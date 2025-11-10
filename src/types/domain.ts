// ============================================
// DOMAIN TYPES - SEO Compass
// ============================================

// --- Auth & Users ---
export type UserRole = 'tech_seo' | 'content_seo' | 'developer';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole | null; // Allow null for OAuth users before role selection
  full_name?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// --- Teams ---
export interface Team {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  profile?: Profile; // Optional profile data
}

// --- Projects ---
export interface Project {
  id: string;
  name: string;
  domain?: string;
  description: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

// --- Content & On-Page Analyzer ---
export type AuditStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface ContentAudit {
  id: string;
  project_id: string;
  url: string;
  status: AuditStatus;
  title: string;
  meta_description: string;
  h1: string;
  word_count: number;
  optimization_score: number;
  issues: AuditIssue[];
  recommendations: string[];
  created_at: string;
}

export type IssueType = 
  | '404_error'
  | 'redirect'
  | 'duplicate_title'
  | 'duplicate_description'
  | 'missing_anchor_text'
  | 'missing_canonical'
  | 'missing_hreflang'
  | 'missing_meta_description'
  | 'missing_h1'
  | 'thin_content';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface AuditIssue {
  id: string;
  audit_id: string;
  type: IssueType;
  severity: IssueSeverity;
  message: string;
  element?: string;
  created_at: string;
}

// --- Action Center ---
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  due_date?: string;
  linked_audit_id?: string;
  linked_audit_type?: 'content';
  created_at: string;
  updated_at: string;
}

// --- Common Types ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
