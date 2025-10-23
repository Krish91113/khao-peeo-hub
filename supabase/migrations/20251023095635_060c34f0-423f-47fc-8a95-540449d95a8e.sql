-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('owner', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create tables table for restaurant tables
CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 4,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  current_order_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

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

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view orders"
  ON public.orders FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON public.orders FOR UPDATE
  TO authenticated USING (true);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view order items"
  ON public.order_items FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create order items"
  ON public.order_items FOR INSERT
  TO authenticated WITH CHECK (true);

-- Create bills table
CREATE TABLE public.bills (
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

CREATE POLICY "Authenticated users can view bills"
  ON public.bills FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create bills"
  ON public.bills FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update bills"
  ON public.bills FOR UPDATE
  TO authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_restaurant_tables_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'role')::user_role
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample restaurant tables
INSERT INTO public.restaurant_tables (table_number, capacity) VALUES
  ('101', 2),
  ('102', 4),
  ('103', 4),
  ('104', 6),
  ('201', 2),
  ('202', 4),
  ('203', 4),
  ('301', 8),
  ('302', 4),
  ('303', 2);