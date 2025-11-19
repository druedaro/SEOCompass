import type { Profile } from './user';

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
  role: string;
  joined_at: string;
  profile?: Profile;
}
