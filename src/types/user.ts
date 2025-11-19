export type UserRole = 'tech_seo' | 'content_seo' | 'seo_manager';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole | null;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
