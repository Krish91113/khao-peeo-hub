# Getting Started - Running Khao Peeo Restaurant System

## Prerequisites

Before running the application, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase Account** - [Sign up here](https://supabase.com/)

## Step 1: Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd khao-peeo
npm install
```

## Step 2: Set Up Supabase

### Option A: Using Existing Supabase Project

If you already have a Supabase project:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy your:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public key** (VITE_SUPABASE_PUBLISHABLE_KEY)

### Option B: Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Fill in project details:
   - Name: `khao-peeo` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to be created (2-3 minutes)
5. Go to **Settings** → **API** and copy your credentials

## Step 3: Configure Environment Variables

Create a `.env` file in the `khao-peeo` directory:

```bash
# Create .env file
touch .env
```

Add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**Example:**
```env
VITE_SUPABASE_URL=https://jygvixsxqicbjocqgbdv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Run Database Migrations

You need to run the database migrations to set up the schema. There are two ways:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref jygvixsxqicbjocqgbdv
   ```
   (Replace `jygvixsxqicbjocqgbdv` with your project reference)

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option B: Using Supabase Dashboard (Easier)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the existing migration first:
   - Open `supabase/migrations/20251023095635_060c34f0-423f-47fc-8a95-540449d95a8e.sql`
   - Copy and paste the contents into SQL Editor
   - Click **Run**

4. Then run the new migration:
   - Open `supabase/migrations/20250124000000_add_order_status_and_waiter_role.sql`
   - Copy and paste the contents into SQL Editor
   - Click **Run**

   **Note:** If you get an error about enum values, you may need to run this migration in two parts:
   
   **Part 1 - Add waiter role:**
   ```sql
   DO $$ 
   BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'waiter' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
       ALTER TYPE public.user_role ADD VALUE 'waiter';
     END IF;
   END $$;
   ```
   
   **Part 2 - Create order_status enum and update orders table:**
   ```sql
   -- Create order_status enum if it doesn't exist
   DO $$
   BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
       CREATE TYPE public.order_status AS ENUM ('pending', 'sent_to_kitchen', 'preparing', 'ready', 'served');
     END IF;
   END $$;

   -- Convert existing status values to match new enum
   ALTER TABLE public.orders ALTER COLUMN status TYPE TEXT;

   ALTER TABLE public.orders 
     ALTER COLUMN status TYPE public.order_status USING 
       CASE 
         WHEN status = 'pending' THEN 'pending'::public.order_status
         WHEN status = 'sent_to_kitchen' THEN 'sent_to_kitchen'::public.order_status
         WHEN status = 'preparing' THEN 'preparing'::public.order_status
         WHEN status = 'ready' THEN 'ready'::public.order_status
         WHEN status = 'served' THEN 'served'::public.order_status
         ELSE 'pending'::public.order_status
       END;

   ALTER TABLE public.orders 
     ALTER COLUMN status SET DEFAULT 'pending'::public.order_status;
   ```

## Step 5: Create Test Users (Optional)

To test the system, you may want to create test users with different roles:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Create users with different roles:
   - **Owner**: Role = `owner`
   - **Admin**: Role = `admin` (default)
   - **Waiter**: Role = `waiter` (after migration)

You can also sign up through the app at `/auth` route.

## Step 6: Run the Application

Start the development server:

```bash
npm run dev
```

The application will start on **http://localhost:8080** (as configured in vite.config.ts)

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://[your-ip]:8080/
```

## Step 7: Access the Application

Open your browser and navigate to:

- **Home Page**: http://localhost:8080/
- **Authentication**: http://localhost:8080/auth
- **Admin Dashboard (POS - Stage 1)**: http://localhost:8080/admin-dashboard
- **Waiter Dashboard (Stage 1 & 2)**: http://localhost:8080/waiter-dashboard
- **Kitchen Display**: http://localhost:8080/kitchen-display
- **Owner Dashboard**: http://localhost:8080/owner-dashboard

## Testing the System

### Stage 1 Flow (Manual POS Entry):

1. **Login as Admin**:
   - Go to `/auth`
   - Sign in with admin credentials

2. **Create Order via POS**:
   - Go to `/admin-dashboard`
   - Select a table
   - Add items to cart
   - Click "Generate Bill & Ticket"
   - Order is sent to kitchen with status `sent_to_kitchen`

3. **Kitchen Prepares Order**:
   - Open `/kitchen-display` in another browser/tab
   - See the new order in "New Orders" tab
   - Click "Start Preparing" → status changes to `preparing`
   - Click "Mark as Ready" → status changes to `ready`

4. **Waiter Serves Order**:
   - Open `/waiter-dashboard`
   - See ready order in "Ready to Serve" tab (with notification badge)
   - Click "Mark as Served" → status changes to `served`

### Stage 2 Flow (Smartphone Order Entry):

1. **Login as Waiter**:
   - Go to `/auth`
   - Sign in with waiter credentials

2. **Create Order from Smartphone**:
   - Go to `/waiter-dashboard` (best viewed on mobile/tablet)
   - Click "New Order" tab
   - Select an available table
   - Add items to cart
   - Click "Generate Bill & Ticket"
   - Order is sent to kitchen automatically

3. **Kitchen & Waiter Flow**:
   - Same as Stage 1 steps 3-4
   - Real-time updates will sync automatically

## Troubleshooting

### Issue: "Missing environment variables"

**Solution**: Make sure you've created `.env` file with correct Supabase credentials.

### Issue: "Migration errors"

**Solution**: 
- Check if you've run the first migration (20251023095635...)
- Try running the enum additions separately (see Step 4, Option B)

### Issue: "Cannot access dashboard - redirects to /auth"

**Solution**: 
- Make sure you're logged in
- Check that your user profile has the correct role in Supabase

### Issue: "Real-time updates not working"

**Solution**:
- Check Supabase Dashboard → **Database** → **Replication**
- Ensure **Replication** is enabled for the tables
- Check browser console for connection errors

### Issue: "Port 8080 already in use"

**Solution**: 
- Change the port in `vite.config.ts`:
  ```typescript
  server: {
    port: 3000, // or any available port
  }
  ```

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Next Steps

- Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for detailed feature documentation
- Customize menu items in `OrderEntry.tsx`
- Add more tables via Supabase Dashboard or create an admin interface
- Configure email templates for user signup (Supabase Dashboard → Authentication → Email Templates)

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Logs
- Check browser console for errors
- Verify database migrations completed successfully

---

**Happy coding! 🚀**

