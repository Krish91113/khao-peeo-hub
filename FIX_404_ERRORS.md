# Fix 404 Errors - Database Tables Not Found

## The Problem

You're seeing these errors:
```
GET /rest/v1/profiles ... 404 (Not Found)
GET /rest/v1/restaurant_tables ... 404 (Not Found)
```

**This means the database tables don't exist yet!**

## Quick Fix (2 Minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard**
2. Select your project: `vbyjdgsoevvgvtzhmgge`
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Setup Script

1. Open the file: `setup_database.sql` (in your project folder)
2. **Copy the ENTIRE contents** of the file
3. **Paste into Supabase SQL Editor**
4. Click **RUN** button (or press Ctrl+Enter)

### Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. You should now see these tables:
   - ✅ `profiles`
   - ✅ `restaurant_tables` 
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `bills`

3. Click on `restaurant_tables` - you should see 10 tables (101, 102, 103, etc.)

### Step 4: Fix Your Existing User Profile

Since you already signed up, you need to create a profile for your user:

In SQL Editor, run this:

```sql
-- Create profile for existing user (replace with your user ID from auth.users)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE((u.raw_user_meta_data->>'role')::user_role, 'admin'::user_role)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id);
```

This will create profiles for all existing users.

### Step 5: Refresh Your App

1. Go back to your app: **http://localhost:8080**
2. **Refresh the page** (F5 or Ctrl+R)
3. **Try logging in again**
4. Tables should now load! ✅

## What If It Still Doesn't Work?

### Check 1: Are tables visible in Table Editor?
- If YES → Tables exist, check RLS policies
- If NO → Run setup script again

### Check 2: RLS Policies
Make sure you're logged in. The tables use Row Level Security (RLS) which requires authentication.

### Check 3: Browser Console
Open browser console (F12) and check for specific error messages.

## Success Indicators

After running the script, you should see:
- ✅ No more 404 errors in console
- ✅ Tables load in Admin Dashboard
- ✅ Can select tables and create orders
- ✅ User profile loads correctly

## Need Help?

1. Check `SETUP_DATABASE.md` for detailed instructions
2. Verify tables exist in Supabase Table Editor
3. Check browser console for specific error messages

---

**The setup script is safe to run multiple times** - it won't create duplicates!

