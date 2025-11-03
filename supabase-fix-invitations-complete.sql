-- Complete Fix for Invitations System
-- Run this script in Supabase SQL Editor
-- This fixes RLS policies and email synchronization

-- ============================================
-- STEP 1: Add email column to profiles
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
    RAISE NOTICE 'Added email column to profiles table';
  ELSE
    RAISE NOTICE 'Email column already exists in profiles table';
  END IF;
END $$;

-- ============================================
-- STEP 2: Update profile creation trigger
-- ============================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved function that includes email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the user's email
  user_email := NEW.email;
  
  -- Insert or update profile with email
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    user_email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing profiles with email
UPDATE profiles
SET email = auth.users.email,
    updated_at = NOW()
FROM auth.users
WHERE profiles.user_id = auth.users.id
AND (profiles.email IS NULL OR profiles.email = '');

-- ============================================
-- STEP 3: Fix Invitations RLS Policies
-- ============================================

-- Remove ALL existing policies dynamically (works regardless of policy names)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'invitations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON invitations', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

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

-- Policy 5: Team owners, members, and invitation creator can delete invitations
CREATE POLICY "Authorized users can delete invitations"
ON invitations
FOR DELETE
USING (
  invited_by = auth.uid()
  OR
  team_id IN (
    SELECT id
    FROM teams
    WHERE user_id = auth.uid()
  )
  OR
  team_id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- STEP 4: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_team_id ON invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON invitations(invited_by);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- STEP 5: Grant permissions
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON invitations TO authenticated;
GRANT SELECT, UPDATE ON profiles TO authenticated;

-- ============================================
-- STEP 6: Verify setup
-- ============================================

-- Check if profiles have emails
SELECT 
  COUNT(*) as total_profiles,
  COUNT(email) as profiles_with_email,
  COUNT(*) - COUNT(email) as profiles_missing_email
FROM profiles;

-- List all invitation policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies
WHERE tablename = 'invitations'
ORDER BY policyname;

-- Done!
SELECT 'Invitations system fixed successfully! ✅' as status;
