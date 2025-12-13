-- Add waiter role to user_role enum
-- Note: ALTER TYPE ADD VALUE cannot run inside a transaction block
-- This may need to be run separately if using migrations tool
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'waiter' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
    ALTER TYPE public.user_role ADD VALUE 'waiter';
  END IF;
END $$;

-- Create order_status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending', 'sent_to_kitchen', 'preparing', 'ready', 'served');
  END IF;
END $$;

-- Convert existing status values to match new enum
-- First, allow the column to accept text temporarily
ALTER TABLE public.orders ALTER COLUMN status TYPE TEXT;

-- Update the column to use the enum type
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

-- Set default to 'pending'
ALTER TABLE public.orders 
  ALTER COLUMN status SET DEFAULT 'pending'::public.order_status;

