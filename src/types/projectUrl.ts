export interface ProjectUrl {
  id: string;
  project_id: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectUrlInput {
  project_id: string;
  url: string;
  label?: string;
}
