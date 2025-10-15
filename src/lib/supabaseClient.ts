import { createClient } from '@supabase/supabase-js';

// Reads the values you will put in .env.local on your computer.
// Do not hardcode keys here.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Helpful dev message — does not change UI.
  // Open README for how to set .env.local
  console.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Export a single client instance for the whole app.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
