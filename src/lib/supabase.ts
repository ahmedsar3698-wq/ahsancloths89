import { createClient } from '@supabase/supabase-js';

// Reads from Vite environment variables or configured store settings
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  let storedUrl = '';
  let storedKey = '';
  try {
    const raw = localStorage.getItem('alhafiz_settings_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      storedUrl = parsed.supabaseUrl || '';
      storedKey = parsed.supabaseAnonKey || '';
    }
  } catch (e) {
    // ignore
  }

  const url = envUrl || storedUrl;
  const key = envKey || storedKey;
  return { url, key, isConfigured: Boolean(url && key) };
};

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
    return null;
  }
};

// SQL Schema for the user's Supabase project
export const SUPABASE_SQL_SCHEMA = `-- AL HAFIZ CLOTHS Supabase Database Schema
-- Run this in your Supabase SQL Editor to enable Cloud Sync & Storage

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  description TEXT,
  fabric_type TEXT,
  cutting TEXT DEFAULT '4.25 Gaz (4.0m) Unstitched',
  season TEXT DEFAULT 'All Seasons',
  badge TEXT DEFAULT 'Premium Quality',
  capry_guarantee BOOLEAN DEFAULT true,
  capry_guarantee_text TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  thumbnail TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false
);

-- 3. Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  order_channel TEXT DEFAULT 'WhatsApp',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Public Read Policies
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can insert new orders" ON public.orders FOR INSERT WITH CHECK (true);
`;
