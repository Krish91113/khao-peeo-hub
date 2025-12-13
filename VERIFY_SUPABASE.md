# Fix ERR_NAME_NOT_RESOLVED Error

## Problem
The error `net::ERR_NAME_NOT_RESOLVED` means your browser cannot find the Supabase server at:
```
https://jygvixsxqicbjocqgbdv.supabase.co
```

## Solution Steps

### Step 1: Verify Supabase Project Exists

1. Go to https://supabase.com/dashboard
2. **Check if you're logged in**
3. **Check if the project `jygvixsxqicbjocqgbdv` exists**

If the project doesn't exist or was deleted:
- You need to create a new Supabase project
- Get the new project URL and key
- Update your `.env` file

### Step 2: Get Correct Supabase URL

If the project exists:
1. Go to **Settings** → **API**
2. Copy the **Project URL** (should look like: `https://xxxxx.supabase.co`)
3. Copy the **anon/public** key

### Step 3: Update .env File

Replace the values in your `.env` file with the correct ones:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-ANON-KEY
```

**Important**: Remove any quotes around the values!

### Step 4: Test Connection

Try opening this URL directly in your browser:
```
https://jygvixsxqicbjocqgbdv.supabase.co
```

- **If it loads**: The URL is correct, check network/firewall
- **If it fails**: The project doesn't exist or URL is wrong

## Quick Fix: Create New Supabase Project

If the project doesn't exist:

1. **Go to**: https://supabase.com/dashboard
2. **Click**: "New Project"
3. **Fill in**:
   - Name: `khao-peeo`
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. **Wait** 2-3 minutes for project creation
5. **Go to**: Settings → API
6. **Copy**:
   - Project URL
   - anon/public key
7. **Update** `.env` file with new values
8. **Restart** dev server: `npm run dev`

## Alternative: Check Project Status

1. Go to https://supabase.com/dashboard
2. Look for your project
3. Check if it shows "Paused" or "Inactive"
4. If paused, click "Resume" or reactivate it

## Network Issues

If Supabase works in browser but not in app:
- Check firewall settings
- Check antivirus blocking connections
- Try different network/WiFi
- Check corporate VPN/proxy settings

