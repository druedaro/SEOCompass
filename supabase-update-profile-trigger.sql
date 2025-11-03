-- Update Profile Creation Trigger to Include Email
-- This ensures email is always synced from auth.users to profiles

-- Drop existing function and trigger
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
  
  -- Insert profile with email
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

-- Backfill existing profiles with email if missing
UPDATE profiles
SET email = auth.users.email,
    updated_at = NOW()
FROM auth.users
WHERE profiles.user_id = auth.users.id
AND (profiles.email IS NULL OR profiles.email = '');

-- Verify the update
SELECT 
  p.user_id,
  p.email as profile_email,
  p.full_name,
  p.created_at
FROM profiles p
ORDER BY p.created_at DESC
LIMIT 10;
