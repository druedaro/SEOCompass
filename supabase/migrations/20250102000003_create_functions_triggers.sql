-- ============================================
-- FUNCTION: Auto-add creator to team_members
-- ============================================
CREATE OR REPLACE FUNCTION add_creator_to_team_members()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the team creator as a member with their role
  INSERT INTO team_members (team_id, user_id, role)
  VALUES (
    NEW.id,
    NEW.user_id,
    (SELECT role FROM profiles WHERE user_id = NEW.user_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Add creator to team_members on team creation
-- ============================================
CREATE TRIGGER on_team_created
  AFTER INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_to_team_members();

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-update updated_at on projects
-- ============================================
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Auto-update updated_at on profiles
-- ============================================
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (NEW.id, 'tech_seo'); -- Default role
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Create profile automatically on signup
-- ============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
