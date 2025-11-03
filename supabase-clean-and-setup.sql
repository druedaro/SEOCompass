-- ============================================
-- SUPABASE CLEAN AND SETUP
-- SEO Compass - Clean existing policies and recreate
-- ============================================

-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their teams" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Team owners can update their teams" ON teams;
DROP POLICY IF EXISTS "Team owners can delete their teams" ON teams;
DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;
DROP POLICY IF EXISTS "Team owners can manage team members" ON team_members;
DROP POLICY IF EXISTS "Users can view invitations for their teams" ON invitations;
DROP POLICY IF EXISTS "Team owners can create invitations" ON invitations;
DROP POLICY IF EXISTS "Users can view projects from their teams" ON projects;
DROP POLICY IF EXISTS "Team members can create projects" ON projects;
DROP POLICY IF EXISTS "Team members can update projects" ON projects;
DROP POLICY IF EXISTS "Team members can delete projects" ON projects;
DROP POLICY IF EXISTS "Users can manage keywords in their projects" ON keywords;
DROP POLICY IF EXISTS "Users can manage rankings in their projects" ON keyword_rankings;
DROP POLICY IF EXISTS "Users can manage audits in their projects" ON content_audits;
DROP POLICY IF EXISTS "Users can manage issues in their audits" ON audit_issues;
DROP POLICY IF EXISTS "Users can manage technical audits in their projects" ON technical_audits;
DROP POLICY IF EXISTS "Users can manage tasks in their projects" ON tasks;

-- ============================================
-- STEP 2: RECREATE POLICIES WITHOUT RECURSION
-- ============================================

-- PROFILES: Simple, no dependencies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- TEAMS: Only check ownership, NO team_members lookup
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team owners can update their teams"
  ON teams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Team owners can delete their teams"
  ON teams FOR DELETE
  USING (auth.uid() = user_id);

-- TEAM_MEMBERS: Simple policies without circular references
CREATE POLICY "Users can view own memberships"
  ON team_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Team owners can insert members"
  ON team_members FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team owners can update members"
  ON team_members FOR UPDATE
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team owners can delete members"
  ON team_members FOR DELETE
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

-- INVITATIONS: Based on team ownership
CREATE POLICY "Users can view invitations for their teams"
  ON invitations FOR SELECT
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team owners can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

-- PROJECTS: Based on team ownership
CREATE POLICY "Users can view projects from their teams"
  ON projects FOR SELECT
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members can update projects"
  ON projects FOR UPDATE
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members can delete projects"
  ON projects FOR DELETE
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

-- KEYWORDS: Based on project ownership
CREATE POLICY "Users can manage keywords in their projects"
  ON keywords FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      WHERE p.team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
    )
  );

-- KEYWORD_RANKINGS: Based on keyword ownership
CREATE POLICY "Users can manage rankings in their projects"
  ON keyword_rankings FOR ALL
  USING (
    keyword_id IN (
      SELECT k.id FROM keywords k
      INNER JOIN projects p ON k.project_id = p.id
      WHERE p.team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
    )
  );

-- CONTENT_AUDITS: Based on project ownership
CREATE POLICY "Users can manage audits in their projects"
  ON content_audits FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      WHERE p.team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
    )
  );

-- AUDIT_ISSUES: Based on audit ownership
CREATE POLICY "Users can manage issues in their audits"
  ON audit_issues FOR ALL
  USING (
    audit_id IN (
      SELECT ca.id FROM content_audits ca
      INNER JOIN projects p ON ca.project_id = p.id
      WHERE p.team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
    )
  );

-- TECHNICAL_AUDITS: Based on project ownership
CREATE POLICY "Users can manage technical audits in their projects"
  ON technical_audits FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      WHERE p.team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
    )
  );

-- TASKS: Based on project ownership
CREATE POLICY "Users can manage tasks in their projects"
  ON tasks FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      WHERE p.team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
    )
  );

-- ============================================
-- DONE!
-- ============================================
-- All policies recreated without circular dependencies
-- The key changes:
-- 1. teams: Only checks user_id = auth.uid()
-- 2. team_members: Split into separate INSERT/UPDATE/DELETE policies
-- 3. All other tables: Only query teams directly, never team_members
-- ============================================
