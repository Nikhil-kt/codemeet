import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

// Primary Supabase Client (Service Role for Backend operations)
export const supabase: SupabaseClient = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const isLiveSupabaseConfigured = (): boolean => {
  return (
    !config.supabase.url.includes('mock.supabase.co') &&
    config.supabase.serviceRoleKey !== 'mock-service-role-key'
  );
};

