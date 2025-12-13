# Fix "Failed to Fetch" Signup Error

## Quick Fix Steps

### Step 1: Restart Dev Server
Environment variables only load when Vite starts. You **MUST restart** after creating/modifying `.env`:

1. **Stop the server**: Press `Ctrl+C` in the terminal
2. **Restart**: Run `npm run dev` again
3. **Try signup again**

### Step 2: Verify Environment Variables Are Loaded

Open browser console (F12) and check:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
```

If either shows `undefined`, environment variables aren't loading.

### Step 3: Check Supabase Settings

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (`jygvixsxqicbjocqgbdv`)
3. **Settings → API**:
   - Verify Project URL: `https://jygvixsxqicbjocqgbdv.supabase.co`
   - Copy the `anon/public` key
4. **Update .env file** with exact values (no spaces, no quotes around values)

### Step 4: Check CORS Configuration

1. Supabase Dashboard → **Settings → API**
2. Scroll to **CORS Configuration**
3. Make sure `http://localhost:8080` is allowed
4. If not, add it and save

### Step 5: Check Authentication Settings

1. Supabase Dashboard → **Authentication → Providers → Email**
2. For development, you can:
   - **Disable "Confirm email"** temporarily
   - Or check **"Enable email confirmations"** and verify via email

### Step 6: Check Browser Console

1. Press **F12** → **Console tab**
2. Try signing up again
3. Look for specific error messages
4. Check **Network tab** for failed requests

## Most Common Solution

**Restart the dev server** - This fixes 90% of cases:
```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

## If Still Not Working

### Check .env File Format

Your `.env` file should look like this (no quotes around values):
```env
VITE_SUPABASE_URL=https://jygvixsxqicbjocqgbdv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**NOT** like this:
```env
VITE_SUPABASE_URL="https://jygvixsxqicbjocqgbdv.supabase.co"  ❌ Wrong
VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."  ❌ Wrong
```

### Test Supabase Connection

Try accessing this URL directly in browser:
```
https://jygvixsxqicbjocqgbdv.supabase.co/rest/v1/
```

If it works, Supabase is accessible. If not, check network/firewall.

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try signing up
4. Look for requests to `supabase.co`
5. Click on failed requests → see error details

## Still Need Help?

1. Check browser console for exact error message
2. Check Network tab for failed requests
3. Verify Supabase project is active in dashboard
4. Try incognito mode to rule out browser extensions

