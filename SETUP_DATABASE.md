# Setup Database - Quick Guide

## The Problem
You're seeing 404 errors because the database tables don't exist yet:
- `profiles` table - 404 Not Found
- `restaurant_tables` table - 404 Not Found

## The Solution

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: `vbyjdgsoevvgvtzhmgge`
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Complete Setup Script

1. Open the file: `setup_database.sql` (in your project root)
2. **Copy the entire contents** of the file
3. **Paste into Supabase SQL Editor**
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `restaurant_tables` (should have 10 tables: 101, 102, 103, etc.)
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `bills`

### Step 4: Refresh Your App

1. Go back to your app: http://localhost:8080
2. Refresh the page (F5)
3. Try logging in again
4. Tables should now load! ✅

## What This Script Does

- ✅ Creates all required tables
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Creates functions and triggers
- ✅ Adds sample restaurant tables (101-303)
- ✅ Handles existing users (creates profiles if missing)
- ✅ Safe to run multiple times (won't duplicate data)

## Troubleshooting

### "Error: relation already exists"
**Solution**: This is OK! The script is designed to be safe - it won't create duplicates. Just continue.

### "Error: enum already exists"
**Solution**: This is OK! The script checks if things exist first. Just continue.

### Still getting 404 errors?
1. Make sure you ran the entire script
2. Check Table Editor - do you see the tables?
3. Refresh your browser
4. Check browser console for specific error messages

## Quick Test

After running the script:

1. **Go to Table Editor**
2. **Click on `restaurant_tables`**
3. **You should see 10 tables** (101, 102, 103, 104, 201, 202, 203, 301, 302, 303)

If you see the tables, the database is set up correctly! ✅

