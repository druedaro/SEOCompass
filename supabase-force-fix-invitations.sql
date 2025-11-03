-- ============================================
-- FORCE FIX INVITATIONS
-- Drop ALL existing policies and recreate clean ones
-- ============================================

-- Get list of all policies on invitations table (for reference)
-- Run this query first to see what exists:
-- SELECT policyname FROM pg_policies WHERE tablename = 'invitations';

-- Drop ALL possible policies that might exist
DROP POLICY IF EXISTS "Users can view invitations for their teams" ON invitations;
DROP POLICY IF EXISTS "Team owners can create invitations" ON invitations;
DROP POLICY IF EXISTS "Team owners can view invitations" ON invitations;
DROP POLICY IF EXISTS "Team owners can insert invitations" ON invitations;
DROP POLICY IF EXISTS "Team owners can delete invitations" ON invitations;
DROP POLICY IF EXISTS "Team owners can manage invitations" ON invitations;
DROP POLICY IF EXISTS "Invited users can view their invitations" ON invitations;

-- Make absolutely sure RLS is enabled
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Create ONLY these three simple policies
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
-- DONE!
-- ============================================
-- Invitations table now has clean, simple RLS policies
-- No references to auth.users table
-- ============================================
