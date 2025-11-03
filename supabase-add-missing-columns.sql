-- ============================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- SEO Compass - Update table structure
-- ============================================

-- Add description and location columns to teams table if they don't exist
DO $$ 
BEGIN
  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teams' AND column_name = 'description'
  ) THEN
    ALTER TABLE teams ADD COLUMN description TEXT;
  END IF;

  -- Add location column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teams' AND column_name = 'location'
  ) THEN
    ALTER TABLE teams ADD COLUMN location TEXT;
  END IF;
END $$;

-- Add full_name and avatar_url to profiles table if they don't exist
DO $$ 
BEGIN
  -- Add full_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;

  -- Add avatar_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- ============================================
-- DONE!
-- ============================================
-- All missing columns have been added safely
-- Tables updated:
-- - teams: description, location
-- - profiles: full_name, avatar_url
-- ============================================
