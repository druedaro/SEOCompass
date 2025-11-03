-- Fix Invitations RLS Policies
-- This script creates proper RLS policies for invitations without requiring auth.users access

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view invitations for their teams" ON invitations;
DROP POLICY IF EXISTS "Users can view invitations sent to their email" ON invitations;
DROP POLICY IF EXISTS "Team members can create invitations" ON invitations;
DROP POLICY IF EXISTS "Users can update their own invitations" ON invitations;
DROP POLICY IF EXISTS "Team admins can delete invitations" ON invitations;

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view invitations for teams they are members of
CREATE POLICY "Users can view team invitations"
ON invitations
FOR SELECT
USING (
  team_id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid()
  )
  OR
  team_id IN (
    SELECT id
    FROM teams
    WHERE user_id = auth.uid()
  )
);

-- Policy 2: Users can view invitations sent to their email
-- We'll check against profiles table instead of auth.users
CREATE POLICY "Users can view their email invitations"
ON invitations
FOR SELECT
USING (
  email IN (
    SELECT email
    FROM profiles
    WHERE user_id = auth.uid()
  )
);

-- Policy 3: Team members can create invitations for their teams
-- Simplified: only check if user is in team_members or is team owner
CREATE POLICY "Team members can create invitations"
ON invitations
FOR INSERT
WITH CHECK (
  team_id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid()
  )
  OR
  team_id IN (
    SELECT id
    FROM teams
    WHERE user_id = auth.uid()
  )
);

-- Policy 4: Users can update invitations (accept/decline)
CREATE POLICY "Users can update their invitations"
ON invitations
FOR UPDATE
USING (
  email IN (
    SELECT email
    FROM profiles
    WHERE user_id = auth.uid()
  )
  OR
  invited_by = auth.uid()
);

-- Policy 5: Team admins and invitation creator can delete invitations
CREATE POLICY "Authorized users can delete invitations"
ON invitations
FOR DELETE
USING (
  invited_by = auth.uid()
  OR
  team_id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
  OR
  team_id IN (
    SELECT id
    FROM teams
    WHERE user_id = auth.uid()
  )
);

-- Ensure profiles table has email column and is accessible
-- Add email column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Create a trigger to sync email from auth.users to profiles
-- This runs when a profile is created or updated
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Get email from auth.users and update profile
  UPDATE profiles
  SET email = (SELECT email FROM auth.users WHERE id = NEW.user_id)
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_profile_created_sync_email ON profiles;

-- Create trigger
CREATE TRIGGER on_profile_created_sync_email
AFTER INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION sync_profile_email();

-- Backfill existing profiles with emails
UPDATE profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.user_id = auth.users.id
AND profiles.email IS NULL;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON invitations TO authenticated;
GRANT SELECT ON profiles TO authenticated;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_team_id ON invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'invitations'
ORDER BY policyname;
