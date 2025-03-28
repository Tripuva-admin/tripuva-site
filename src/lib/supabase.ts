import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with proper typing
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Initialize auth state with error handling
supabase.auth.onAuthStateChange((event) => {
  try {
    if (event === 'SIGNED_IN') {
      console.log('User signed in successfully');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out successfully');
    }
  } catch (error) {
    console.error('Auth state change error:', error);
  }
});