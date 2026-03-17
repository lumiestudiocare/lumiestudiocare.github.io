import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  ?? '';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON ?? '';

// Safe client — falls back gracefully if env vars not set
export const supabase = SUPABASE_URL && SUPABASE_ANON
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const supabaseReady = !!(SUPABASE_URL && SUPABASE_ANON);
