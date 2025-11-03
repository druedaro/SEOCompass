// ============================================
// DOMAIN TYPES - SEO Compass
// ============================================

// --- Auth & Users ---
export type UserRole = 'tech_seo' | 'content_seo' | 'developer';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole | null; // Allow null for OAuth users before role selection
  created_at: string;
  updated_at: string;
}

// --- Teams ---
export interface Team {
  id: string;
  name: string;
  location: string;
  user_id: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export interface Invitation {
  id: string;
  team_id: string;
  email: string;
  token: string;
  status: InvitationStatus;
  created_at: string;
}

// --- Projects ---
export interface Project {
  id: string;
  name: string;
  description: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

// --- Module 1: Keyword Tracker ---
export interface Keyword {
  id: string;
  project_id: string;
  keyword: string;
  search_volume: number;
  difficulty: number;
  created_at: string;
}

export interface KeywordRanking {
  id: string;
  keyword_id: string;
  position: number;
  url: string;
  checked_at: string;
}

// --- Module 2: Content & On-Page Analyzer ---
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

// --- Module 3: Technical SEO Audit ---
export interface TechnicalAudit {
  id: string;
  project_id: string;
  url: string;
  status: AuditStatus;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  opportunities: Opportunity[];
  diagnostics: Diagnostic[];
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  savings_ms: number;
}

export interface Diagnostic {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
}

// --- Module 4: Action Center ---
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
  linked_audit_type?: 'content' | 'technical';
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
