import { createClient } from '@supabase/supabase-js';

// Use non-null assertion only if you're certain the variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or API key. Please check your environment variables.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
