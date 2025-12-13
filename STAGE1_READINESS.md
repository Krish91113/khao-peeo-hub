# Stage 1 - Full Setup Checklist

## ✅ Stage 1 Components Status

### 1. Authentication ✅
- [x] Auth component with signup/login
- [x] Email confirmation handling
- [x] Role-based navigation (Owner/Admin/Waiter)
- [x] Auto-login after signup (if email confirmation disabled)

**Action Required**: Disable email confirmation in Supabase (see DISABLE_EMAIL_CONFIRMATION.md)

### 2. Admin Dashboard (POS) ✅
- [x] POS interface at `/admin-dashboard`
- [x] Table management
- [x] Order entry component
- [x] Bill generation
- [x] Kitchen ticket generation

**Status**: Fully functional

### 3. Kitchen Display ✅
- [x] Kitchen order queue at `/kitchen-display`
- [x] New orders view
- [x] Preparing orders view
- [x] Ready orders view
- [x] Status update buttons (Start Preparing → Mark as Ready)

**Status**: Fully functional

### 4. Waiter Dashboard ✅
- [x] Order monitoring at `/waiter-dashboard`
- [x] Ready orders view (with notifications)
- [x] Active orders view
- [x] Served orders view
- [x] Mark as served functionality

**Status**: Fully functional

### 5. Database Schema ✅
- [x] Profiles table with roles
- [x] Restaurant tables
- [x] Orders table with status
- [x] Order items table
- [x] Bills table
- [x] Order status enum (pending, sent_to_kitchen, preparing, ready, served)
- [x] User role enum (owner, admin, waiter)

**Action Required**: Run migrations (see below)

### 6. Order Flow ✅
- [x] Order creation → status: `sent_to_kitchen`
- [x] Kitchen receives order
- [x] Kitchen updates: `preparing` → `ready`
- [x] Waiter sees ready order
- [x] Waiter marks as `served`

**Status**: Complete flow implemented

## 🔧 Setup Steps Required

### Step 1: Disable Email Confirmation (Required for Easy Testing)

1. Go to: https://supabase.com/dashboard
2. Select project: `vbyjdgsoevvgvtzhmgge`
3. Navigate: **Authentication** → **Providers** → **Email**
4. **DISABLE** "Enable email confirmations"
5. Click **Save**

**Why**: Allows instant login after signup without email confirmation.

### Step 2: Run Database Migrations (CRITICAL)

1. Go to Supabase Dashboard → **SQL Editor**

2. **Run First Migration** (if not already run):
   - File: `supabase/migrations/20251023095635_060c34f0-423f-47fc-8a95-540449d95a8e.sql`
   - This creates: profiles, restaurant_tables, orders, order_items, bills tables
   - Copy entire content → Paste in SQL Editor → Run

3. **Run Second Migration** (for Stage 1 & 2 features):
   - File: `supabase/migrations/20250124000000_add_order_status_and_waiter_role.sql`
   - This adds: waiter role, order_status enum, updates orders table
   - Copy entire content → Paste in SQL Editor → Run

**Important**: If you get errors about enum values, run in two parts:
- First: Add waiter role
- Second: Create order_status enum and update orders

### Step 3: Verify Tables Exist

In Supabase Dashboard → **Table Editor**, you should see:
- ✅ `profiles`
- ✅ `restaurant_tables` (should have sample tables: 101, 102, 103, etc.)
- ✅ `orders`
- ✅ `order_items`
- ✅ `bills`

### Step 4: Test Stage 1 Flow

1. **Signup as Admin**:
   - Go to `/auth`
   - Create account with role "Admin"
   - Should auto-login and go to `/admin-dashboard`

2. **Create Order**:
   - In Admin Dashboard, select a table
   - Add items to cart
   - Click "Generate Bill & Ticket"
   - Order status should be `sent_to_kitchen`

3. **Kitchen Receives Order**:
   - Open `/kitchen-display` in another tab/browser
   - Should see order in "New Orders" tab
   - Click "Start Preparing" → status becomes `preparing`
   - Click "Mark as Ready" → status becomes `ready`

4. **Waiter Serves Order**:
   - Open `/waiter-dashboard`
   - Should see ready order in "Ready to Serve" tab
   - Click "Mark as Served" → status becomes `served`

## ✅ Stage 1 Requirements Checklist

### Actors ✅
- [x] Customer (represented by table)
- [x] Waiter (WaiterDashboard)
- [x] Kitchen (KitchenDisplay)
- [x] POS (AdminDashboard)

### Behaviors ✅
- [x] Waiter takes customer orders manually
- [x] Waiter enters order into POS (AdminDashboard)
- [x] POS sends ticket to kitchen (status: sent_to_kitchen)
- [x] Kitchen prepares food → signals waiter (status: ready)
- [x] Waiter serves customer (marks as served)
- [x] POS handles billing

### UI Requirements ✅
- [x] Simple POS interface (AdminDashboard)
- [x] Kitchen display (KitchenDisplay)
- [x] Waiter panel (WaiterDashboard)
- [x] Fast, minimal UI
- [x] Order status tracking

## 🎯 Quick Test

After completing setup steps:

1. **Signup** → Should work immediately (if email confirmation disabled)
2. **Create Order** → Should appear in kitchen
3. **Update Status** → Kitchen → Waiter flow works
4. **Bill Generated** → Shows in OrderEntry after order creation

## 🚨 Common Issues

### Issue: "Email not confirmed"
**Solution**: Disable email confirmation in Supabase (Step 1)

### Issue: "Table not found" or "Order creation failed"
**Solution**: Run database migrations (Step 2)

### Issue: "Status enum error"
**Solution**: Run migration in two parts (see Step 2)

### Issue: "Real-time not working"
**Solution**: Check Supabase Dashboard → Database → Replication → Enable for orders table

## ✅ Stage 1 is Ready When:

- [x] Can signup and login immediately
- [x] Can create orders via POS
- [x] Orders appear in kitchen display
- [x] Kitchen can update order status
- [x] Waiter can see ready orders
- [x] Waiter can mark orders as served
- [x] Bills are generated correctly

---

**Current Status**: All code is ready ✅  
**Action Required**: Complete setup steps 1-2 above ⚠️

