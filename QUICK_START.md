# Quick Start Guide - Stage 1

## 3 Steps to Get Started

### Step 1: Disable Email Confirmation (1 minute)

1. Go to: https://supabase.com/dashboard
2. Project: `vbyjdgsoevvgvtzhmgge`
3. **Authentication** → **Providers** → **Email**
4. **UNCHECK** "Enable email confirmations"
5. **Save**

### Step 2: Run Database Migrations (2 minutes)

1. Go to Supabase Dashboard → **SQL Editor**

2. **Copy and Run Migration 1**:
   ```
   Open: supabase/migrations/20251023095635_060c34f0-423f-47fc-8a95-540449d95a8e.sql
   Copy entire content → Paste in SQL Editor → Run
   ```

3. **Copy and Run Migration 2**:
   ```
   Open: supabase/migrations/20250124000000_add_order_status_and_waiter_role.sql
   Copy entire content → Paste in SQL Editor → Run
   ```

### Step 3: Test the Flow

1. **Create Account**:
   - Go to: http://localhost:8080/auth
   - Sign up as "Admin"
   - Should auto-login → goes to Admin Dashboard

2. **Create Order**:
   - Click on a table
   - Add items → Generate Bill
   - Order sent to kitchen ✅

3. **Kitchen** (new tab):
   - Go to: http://localhost:8080/kitchen-display
   - See order → Start Preparing → Mark as Ready

4. **Waiter** (new tab):
   - Go to: http://localhost:8080/waiter-dashboard
   - See ready order → Mark as Served

**Done! Stage 1 is working! 🎉**

## Need Help?

- Email confirmation: See `DISABLE_EMAIL_CONFIRMATION.md`
- Full setup: See `STAGE1_READINESS.md`
- Troubleshooting: See `FIX_SIGNUP_ERROR.md`

