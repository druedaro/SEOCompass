# Fixing Invitations System - Instructions

## Problem
When trying to send team invitations, you get this error:
```
Error inviting member: {code: '42501', message: 'permission denied for table users'}
```

This happens because the RLS (Row Level Security) policies were trying to access `auth.users` table directly, which is not allowed in Supabase.

## Solution

I've created a complete fix that:
1. ✅ Adds an `email` column to the `profiles` table
2. ✅ Creates a trigger to automatically sync emails from `auth.users` to `profiles`
3. ✅ Updates all RLS policies to use `profiles.email` instead of `auth.users.email`
4. ✅ Re-enables invitation functionality in the app

## How to Apply the Fix

### Step 1: Run SQL Script in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-fix-invitations-complete.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 2: Verify the Fix

The script will show a success message at the end:
```
✅ Invitations system fixed successfully!
```

It will also show:
- How many profiles have emails
- All the RLS policies created for invitations

### Step 3: Test in Your App

1. Make sure your dev server is running (`npm run dev`)
2. Log in to your app
3. Go to Team Members page
4. Click "Invite Member"
5. Enter an email and select a role
6. Click "Send Invitation"

✅ **It should work now without errors!**

## What Changed

### Database Changes:

1. **profiles table**:
   - Added `email` column
   - Auto-syncs with `auth.users.email`

2. **invitations table** - New RLS policies:
   - `Users can view team invitations` - View invitations for your teams
   - `Users can view their email invitations` - View invitations sent to your email
   - `Team members can create invitations` - Team members can invite others
   - `Users can update their invitations` - Accept/decline invitations
   - `Authorized users can delete invitations` - Delete/cancel invitations

3. **Performance indexes** created for:
   - `invitations.email`
   - `invitations.team_id`
   - `invitations.status`
   - `profiles.email`

### Code Changes:

- **WorkspaceContext**: Re-enabled `refreshInvitations()` function
- No other code changes needed! The fix is entirely in the database.

## How It Works Now

1. When a user signs up, the trigger automatically copies their email to `profiles.email`
2. When you create an invitation:
   - The RLS policy checks if you're a member of the team (via `team_members` or `teams.user_id`)
   - No direct access to `auth.users` is needed
3. When viewing invitations:
   - Users see invitations for their teams
   - Users see invitations sent to their email (checked against `profiles.email`)

## Troubleshooting

### If you still get errors:

1. **Check if the script ran successfully**:
   ```sql
   -- In Supabase SQL Editor, run:
   SELECT COUNT(*) as total, COUNT(email) as with_email 
   FROM profiles;
   ```
   All profiles should have emails.

2. **Check RLS policies**:
   ```sql
   -- In Supabase SQL Editor, run:
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'invitations';
   ```
   You should see 5 policies.

3. **Clear browser cache and refresh** the app

4. **Check browser console** for any other errors

### If invitations still don't work:

Run this query to check your current user's profile:
```sql
SELECT 
  p.user_id,
  p.email as profile_email,
  p.full_name
FROM profiles p
WHERE p.user_id = auth.uid();
```

Make sure your profile has an email address.

## Additional Features Now Working

With this fix, these invitation features now work:

- ✅ Send team invitations
- ✅ View pending invitations (as team admin)
- ✅ Accept/decline invitations (as invited user)
- ✅ Cancel invitations (as team admin)
- ✅ Automatic invitation expiration (7 days)

## Files Modified

1. `supabase-fix-invitations-complete.sql` - Complete fix script ⭐ **RUN THIS**
2. `src/context/WorkspaceContext.tsx` - Re-enabled invitations
3. `INVITATIONS-FIX-README.md` - This file (instructions)

## Next Steps

After applying the fix:

1. ✅ Test sending invitations
2. ✅ Test accepting invitations (create a second account with different email)
3. ✅ Check that invitation list updates in real-time
4. ✅ Verify that expired invitations are filtered out

---

**Need Help?**

If you encounter any issues:
1. Check the Supabase logs: Dashboard → Logs → Database
2. Check browser console for client-side errors
3. Verify you're logged in with a user that's part of a team
