export type UserRole = 'tech_seo' | 'content_seo' | 'developer';

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
  profile?: Profile;
}

export interface Project {
  id: string;
  name: string;
  domain?: string;
  description: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}
