-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TEAMS POLICIES
-- ============================================

-- Users can view teams they are members of
CREATE POLICY "Users can view teams they belong to"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Users can create teams
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Team creators can update their teams
CREATE POLICY "Team creators can update teams"
  ON teams FOR UPDATE
  USING (auth.uid() = user_id);

-- Team creators can delete their teams
CREATE POLICY "Team creators can delete teams"
  ON teams FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TEAM_MEMBERS POLICIES
-- ============================================

-- Users can view members of teams they belong to
CREATE POLICY "Users can view team members of their teams"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

-- Team creators can add members
CREATE POLICY "Team creators can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.user_id = auth.uid()
    )
  );

-- Team creators can remove members
CREATE POLICY "Team creators can remove members"
  ON team_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.user_id = auth.uid()
    )
  );

-- ============================================
-- INVITATIONS POLICIES
-- ============================================

-- Users can view invitations to teams they belong to
CREATE POLICY "Users can view team invitations"
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = invitations.team_id
      AND team_members.user_id = auth.uid()
    )
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Team creators can create invitations
CREATE POLICY "Team creators can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = invitations.team_id
      AND teams.user_id = auth.uid()
    )
  );

-- Team creators can update invitations
CREATE POLICY "Team creators can update invitations"
  ON invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = invitations.team_id
      AND teams.user_id = auth.uid()
    )
  );

-- Team creators can delete invitations
CREATE POLICY "Team creators can delete invitations"
  ON invitations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = invitations.team_id
      AND teams.user_id = auth.uid()
    )
  );

-- ============================================
-- PROJECTS POLICIES
-- ============================================

-- Users can view projects of teams they belong to
CREATE POLICY "Users can view team projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team members can create projects
CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team members can update projects
CREATE POLICY "Team members can update projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team creators can delete projects
CREATE POLICY "Team creators can delete projects"
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = projects.team_id
      AND teams.user_id = auth.uid()
    )
  );
