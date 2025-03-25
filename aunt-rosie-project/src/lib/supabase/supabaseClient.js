import { createClient } from '@supabase/supabase-js'

// Create a single supabase instance
let supabaseInstance = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'aunt-rosie-storage-key'
      }
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient(); 