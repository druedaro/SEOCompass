-- ============================================
-- FIX RELATIONSHIPS AND PERMISSIONS
-- SEO Compass - Enable team members and invitations
-- ============================================

-- ============================================
-- STEP 1: ADD MISSING POLICIES FOR PROFILES
-- ============================================

-- Allow users to read other users' profiles (needed for team member display)
DROP POLICY IF EXISTS "Users can view profiles of team members" ON profiles;
CREATE POLICY "Users can view profiles of team members"
  ON profiles FOR SELECT
  USING (
    -- Can view own profile
    auth.uid() = user_id 
    OR
    -- Can view profiles of users in same teams
    user_id IN (
      SELECT tm.user_id 
      FROM team_members tm
      WHERE tm.team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- STEP 2: FIX INVITATIONS POLICIES
-- ============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view invitations for their teams" ON invitations;
DROP POLICY IF EXISTS "Team owners can create invitations" ON invitations;

-- Allow team owners to manage invitations
CREATE POLICY "Team owners can view invitations"
  ON invitations FOR SELECT
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team owners can insert invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

CREATE POLICY "Team owners can delete invitations"
  ON invitations FOR DELETE
  USING (
    team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
  );

-- ============================================
-- STEP 3: UPDATE INVITATIONS TABLE SCHEMA
-- ============================================

-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'role'
  ) THEN
    ALTER TABLE invitations ADD COLUMN role user_role DEFAULT 'content_seo';
  END IF;
END $$;

-- Add invited_by column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'invited_by'
  ) THEN
    ALTER TABLE invitations ADD COLUMN invited_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Add expires_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE invitations ADD COLUMN expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days');
  END IF;
END $$;

-- ============================================
-- DONE!
-- ============================================
-- Changes made:
-- 1. Added policy to view team member profiles
-- 2. Fixed invitation policies (no longer requires auth.users access)
-- 3. Added missing columns to invitations table (role, invited_by, expires_at)
-- 
-- Now you can:
-- - View team members with their profile info
-- - Create and manage invitations
-- - See team location in team settings
-- ============================================
