import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Client-side Supabase instance using only public anon keys (Safe for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isLiveSupabaseFrontend = (): boolean => {
  return (
    !supabaseUrl.includes('mock.supabase.co') &&
    supabaseAnonKey !== 'mock-anon-key'
  );
};
