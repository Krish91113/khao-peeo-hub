# Fix ERR_NAME_NOT_RESOLVED Error

## Problem
```
POST https://jygvixsxqicbjocqgbdv.supabase.co/auth/v1/signup
net::ERR_NAME_NOT_RESOLVED
```

This means the Supabase project URL cannot be found. The project might:
- Not exist
- Be paused/deleted
- Have wrong URL in .env file

## Solution: Verify Supabase Project

### Step 1: Check if Project Exists

1. **Go to**: https://supabase.com/dashboard
2. **Login** with your Supabase account
3. **Check** if you see a project with ID `jygvixsxqicbjocqgbdv`

**If you see the project:**
- Click on it
- Go to **Settings** → **API**
- Copy the **Project URL** (should match what's in your .env)
- Check if project status shows "Active"

**If you DON'T see the project:**
- The project was deleted or you don't have access
- You need to create a new project (see Step 2)

### Step 2: Create New Supabase Project (If needed)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: `khao-peeo`
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to be ready
6. Once ready, go to **Settings** → **API**
7. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3: Update .env File

Edit your `.env` file in the `khao-peeo` directory:

```env
VITE_SUPABASE_URL=https://YOUR-NEW-PROJECT-ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-NEW-ANON-KEY
```

**Important**: 
- No quotes around values
- No spaces before/after `=`
- Use the exact URL and key from Supabase dashboard

### Step 4: Restart Dev Server

After updating `.env`:
1. **Stop** the dev server (Ctrl+C)
2. **Start** again: `npm run dev`
3. **Try signup** again

### Step 5: Test Connection

Before trying signup, test if Supabase is reachable:

1. Open browser
2. Go to your Supabase URL (from .env file)
   - Example: `https://xxxxx.supabase.co`
3. If it loads → Project exists and is accessible
4. If it fails → Project doesn't exist or is paused

## Quick Test in Browser Console

Open browser console (F12) and run:

```javascript
fetch('https://jygvixsxqicbjocqgbdv.supabase.co/rest/v1/')
  .then(r => console.log('✓ Connection OK'))
  .catch(e => console.error('✗ Connection Failed:', e));
```

- **If OK**: Project exists, check other issues
- **If Failed**: Project doesn't exist, create new one

## Common Issues

### Project Paused
- Go to Supabase Dashboard
- If project shows "Paused", click "Resume"
- Wait for project to activate

### Wrong Account
- Make sure you're logged into the correct Supabase account
- Check if project is in a different organization

### Network/DNS Issue
- Try accessing Supabase dashboard in browser
- If dashboard works but project URL doesn't, project might be deleted
- Try different network/WiFi
- Check firewall/antivirus settings

## Still Having Issues?

1. **Create a completely new Supabase project**
2. **Copy the new URL and key to .env**
3. **Restart dev server**
4. **Run database migrations** (see GETTING_STARTED.md)

