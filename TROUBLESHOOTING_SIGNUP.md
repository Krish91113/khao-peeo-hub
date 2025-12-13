# Troubleshooting "Failed to Fetch" Signup Error

## Common Causes and Solutions

### 1. **Environment Variables Not Loaded**

**Problem**: The `.env` file exists but Vite isn't loading the variables.

**Solution**:
- Make sure `.env` is in the `khao-peeo` directory (root of the project)
- **Restart the dev server** after creating/modifying `.env`
- Environment variables must start with `VITE_` prefix

**Check**:
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Check browser console (F12) for any errors

### 2. **Supabase Project Not Configured**

**Problem**: Supabase project might not be active or credentials are wrong.

**Solution**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Verify:
   - **Project URL** matches `VITE_SUPABASE_URL` in `.env`
   - **anon/public key** matches `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`

### 3. **CORS Configuration**

**Problem**: Browser blocking requests due to CORS.

**Solution**:
1. Go to Supabase Dashboard → **Settings** → **API**
2. Scroll to **CORS Configuration**
3. Add your local URL: `http://localhost:8080`
4. Click **Save**

### 4. **Email Confirmation Enabled**

**Problem**: Supabase might require email confirmation before allowing signup.

**Solution**:
1. Go to Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Check **Enable email confirmations**
3. If enabled, users must confirm email before login
4. For development, you can disable this temporarily

### 5. **Network/Firewall Issues**

**Problem**: Firewall or network blocking Supabase requests.

**Solution**:
- Check browser console (F12 → Network tab) for blocked requests
- Try accessing Supabase URL directly: `https://jygvixsxqicbjocqgbdv.supabase.co`
- Check if your network/firewall allows HTTPS connections

## Quick Diagnostic Steps

1. **Check Browser Console**:
   - Press F12 → Console tab
   - Look for red error messages
   - Note the exact error message

2. **Check Network Tab**:
   - Press F12 → Network tab
   - Try signing up again
   - Look for failed requests (red)
   - Check the request URL and status

3. **Verify .env File**:
   ```bash
   # In khao-peeo directory
   cat .env
   # Should show:
   # VITE_SUPABASE_URL=https://...
   # VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
   ```

4. **Test Supabase Connection**:
   - Open browser console (F12)
   - Type: `console.log(import.meta.env.VITE_SUPABASE_URL)`
   - Should show your Supabase URL
   - If `undefined`, environment variables aren't loading

## Quick Fix Checklist

- [ ] `.env` file exists in `khao-peeo/` directory
- [ ] `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Restarted dev server after modifying `.env`
- [ ] Supabase project is active and running
- [ ] CORS allows `http://localhost:8080`
- [ ] Browser console shows no blocking errors
- [ ] Network tab shows requests reaching Supabase

## Still Not Working?

1. **Check Supabase Status**: https://status.supabase.com/
2. **Review Supabase Logs**: Dashboard → Logs → Auth logs
3. **Try Incognito Mode**: Rule out browser extension issues
4. **Clear Browser Cache**: Ctrl+Shift+Delete → Clear cache

