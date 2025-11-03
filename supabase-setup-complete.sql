-- ============================================
-- SUPABASE COMPLETE DATABASE SETUP
-- SEO Compass - Full Schema with RLS Policies
-- ============================================

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. CUSTOM TYPES (Create only if not exists)
-- ============================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('tech_seo', 'content_seo', 'developer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE audit_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE issue_type AS ENUM (
    '404_error',
    'redirect',
    'duplicate_title',
    'duplicate_description',
    'missing_anchor_text',
    'missing_canonical',
    'missing_hreflang',
    'missing_meta_description',
    'missing_h1',
    'thin_content'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE issue_severity AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 3. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role user_role,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for teams (users can see teams they're members of)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their teams" ON teams;
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (
    user_id = auth.uid() OR
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team owners can update their teams" ON teams;
CREATE POLICY "Team owners can update their teams"
  ON teams FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team owners can delete their teams" ON teams;
CREATE POLICY "Team owners can delete their teams"
  ON teams FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. TEAM_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- RLS for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;
CREATE POLICY "Users can view team members of their teams"
  ON team_members FOR SELECT
  USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
      UNION
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team owners can manage team members" ON team_members;
CREATE POLICY "Team owners can manage team members"
  ON team_members FOR ALL
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

-- ============================================
-- 6. INVITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  token UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  status invitation_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view invitations for their teams" ON invitations;
CREATE POLICY "Users can view invitations for their teams"
  ON invitations FOR SELECT
  USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team owners can create invitations" ON invitations;
CREATE POLICY "Team owners can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 7. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view projects from their teams" ON projects;
CREATE POLICY "Users can view projects from their teams"
  ON projects FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members can create projects" ON projects;
CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members can update projects" ON projects;
CREATE POLICY "Team members can update projects"
  ON projects FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members can delete projects" ON projects;
CREATE POLICY "Team members can delete projects"
  ON projects FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 8. KEYWORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for keywords
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage keywords in their projects" ON keywords;
CREATE POLICY "Users can manage keywords in their projects"
  ON keywords FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- 9. KEYWORD_RANKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS keyword_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  url TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for keyword_rankings
ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage rankings in their projects" ON keyword_rankings;
CREATE POLICY "Users can manage rankings in their projects"
  ON keyword_rankings FOR ALL
  USING (
    keyword_id IN (
      SELECT k.id FROM keywords k
      INNER JOIN projects p ON k.project_id = p.id
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- 10. CONTENT_AUDITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS content_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  status audit_status DEFAULT 'pending',
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  word_count INTEGER DEFAULT 0,
  optimization_score INTEGER DEFAULT 0,
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for content_audits
ALTER TABLE content_audits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage audits in their projects" ON content_audits;
CREATE POLICY "Users can manage audits in their projects"
  ON content_audits FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- 11. AUDIT_ISSUES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES content_audits(id) ON DELETE CASCADE NOT NULL,
  type issue_type NOT NULL,
  severity issue_severity NOT NULL,
  message TEXT NOT NULL,
  element TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for audit_issues
ALTER TABLE audit_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage issues in their audits" ON audit_issues;
CREATE POLICY "Users can manage issues in their audits"
  ON audit_issues FOR ALL
  USING (
    audit_id IN (
      SELECT ca.id FROM content_audits ca
      INNER JOIN projects p ON ca.project_id = p.id
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- 12. TECHNICAL_AUDITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS technical_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  status audit_status DEFAULT 'pending',
  performance_score INTEGER DEFAULT 0,
  accessibility_score INTEGER DEFAULT 0,
  best_practices_score INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  opportunities JSONB DEFAULT '[]',
  diagnostics JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for technical_audits
ALTER TABLE technical_audits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage technical audits in their projects" ON technical_audits;
CREATE POLICY "Users can manage technical audits in their projects"
  ON technical_audits FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- 13. TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  linked_audit_id UUID,
  linked_audit_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage tasks in their projects" ON tasks;
CREATE POLICY "Users can manage tasks in their projects"
  ON tasks FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- 14. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name, avatar_url)
  VALUES (
    new.id,
    CASE 
      WHEN new.raw_user_meta_data->>'role' IS NOT NULL 
      THEN (new.raw_user_meta_data->>'role')::user_role
      ELSE NULL
    END,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to auto-add team creator as member
CREATE OR REPLACE FUNCTION public.handle_new_team()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (
    new.id,
    new.user_id,
    (SELECT role FROM profiles WHERE user_id = new.user_id)
  );
  RETURN new;
END;
$$;

-- Trigger for new team
DROP TRIGGER IF EXISTS on_team_created ON teams;
CREATE TRIGGER on_team_created
  AFTER INSERT ON teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_team();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_project_updated ON projects;
CREATE TRIGGER on_project_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_task_updated ON tasks;
CREATE TRIGGER on_task_updated
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 15. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_keywords_project_id ON keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_content_audits_project_id ON content_audits(project_id);
CREATE INDEX IF NOT EXISTS idx_technical_audits_project_id ON technical_audits(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Run this script in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================
