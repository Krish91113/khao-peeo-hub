-- =====================================================
-- KHAO PEEO RESTAURANT SYSTEM - COMPLETE DATABASE SETUP
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- Copy everything below and paste into SQL Editor → Run

-- =====================================================
-- STEP 1: Create User Role Enum (with waiter)
-- =====================================================

-- Create enum for user roles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'waiter');
  ELSE
    -- Add waiter if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'waiter' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
      ALTER TYPE public.user_role ADD VALUE 'waiter';
    END IF;
  END IF;
END $$;

-- =====================================================
-- STEP 2: Create Order Status Enum
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending', 'sent_to_kitchen', 'preparing', 'ready', 'served');
  END IF;
END $$;

-- =====================================================
-- STEP 3: Create Profiles Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated USING (true);

-- =====================================================
-- STEP 4: Create Restaurant Tables Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 4,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  current_order_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Authenticated users can update tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Authenticated users can insert tables" ON public.restaurant_tables;

-- RLS Policies for restaurant_tables
CREATE POLICY "Authenticated users can view tables"
  ON public.restaurant_tables FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can update tables"
  ON public.restaurant_tables FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tables"
  ON public.restaurant_tables FOR INSERT
  TO authenticated WITH CHECK (true);

-- =====================================================
-- STEP 5: Create Orders Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
  status public.order_status NOT NULL DEFAULT 'pending'::public.order_status,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Convert status column to use order_status enum if needed
DO $$
BEGIN
  -- Check if status column exists and is TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'status'
    AND data_type = 'text'
  ) THEN
    -- First, drop the default
    ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;
    
    -- Convert to enum
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
    
    -- Now set the default with the correct type
    ALTER TABLE public.orders 
      ALTER COLUMN status SET DEFAULT 'pending'::public.order_status;
  END IF;
  
  -- If column doesn't exist or is already enum, ensure default is set
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'status'
  ) THEN
    -- Set default if not already set or if it's wrong type
    BEGIN
      ALTER TABLE public.orders 
        ALTER COLUMN status SET DEFAULT 'pending'::public.order_status;
    EXCEPTION WHEN OTHERS THEN
      -- Default might already be set correctly, ignore
      NULL;
    END;
  END IF;
END $$;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;

-- RLS Policies for orders
CREATE POLICY "Authenticated users can view orders"
  ON public.orders FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON public.orders FOR UPDATE
  TO authenticated USING (true);

-- =====================================================
-- STEP 6: Create Order Items Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can create order items" ON public.order_items;

-- RLS Policies for order_items
CREATE POLICY "Authenticated users can view order items"
  ON public.order_items FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create order items"
  ON public.order_items FOR INSERT
  TO authenticated WITH CHECK (true);

-- =====================================================
-- STEP 7: Create Bills Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  table_id UUID REFERENCES public.restaurant_tables(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view bills" ON public.bills;
DROP POLICY IF EXISTS "Authenticated users can create bills" ON public.bills;
DROP POLICY IF EXISTS "Authenticated users can update bills" ON public.bills;

-- RLS Policies for bills
CREATE POLICY "Authenticated users can view bills"
  ON public.bills FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create bills"
  ON public.bills FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update bills"
  ON public.bills FOR UPDATE
  TO authenticated USING (true);

-- =====================================================
-- STEP 8: Create Functions
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'admin'::user_role)
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role);
  RETURN NEW;
END;
$$;

-- =====================================================
-- STEP 9: Create Triggers
-- =====================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_restaurant_tables_updated_at ON public.restaurant_tables;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create triggers for updated_at
CREATE TRIGGER update_restaurant_tables_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 10: Insert Sample Restaurant Tables
-- =====================================================

-- Insert sample tables only if they don't exist
INSERT INTO public.restaurant_tables (table_number, capacity)
SELECT '101', 2
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '101')
UNION ALL
SELECT '102', 4
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '102')
UNION ALL
SELECT '103', 4
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '103')
UNION ALL
SELECT '104', 6
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '104')
UNION ALL
SELECT '201', 2
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '201')
UNION ALL
SELECT '202', 4
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '202')
UNION ALL
SELECT '203', 4
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '203')
UNION ALL
SELECT '301', 8
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '301')
UNION ALL
SELECT '302', 4
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '302')
UNION ALL
SELECT '303', 2
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables WHERE table_number = '303');

-- =====================================================
-- STEP 11: Fix Existing User Profiles (if any)
-- =====================================================

-- Create profiles for existing users that don't have profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE((u.raw_user_meta_data->>'role')::user_role, 'admin'::user_role)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- You should now see these tables in Table Editor:
-- ✅ profiles
-- ✅ restaurant_tables (with 10 sample tables)
-- ✅ orders
-- ✅ order_items
-- ✅ bills
-- 
-- Go to Table Editor to verify all tables exist!

