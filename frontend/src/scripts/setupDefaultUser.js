const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '/workspace/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_EMAIL = 'barclaybrandon@hotmail.com';
const DEFAULT_PASSWORD = 'password';

async function setupDefaultUser() {
  // Check if the user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', DEFAULT_EMAIL)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking for existing user:', fetchError);
    return;
  }

  if (existingUser) {
    console.log('Default user already exists');
    return;
  }

  // Create the default user
  const { error: signUpError } = await supabase.auth.signUp({
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD,
  });

  if (signUpError) {
    console.error('Error creating default user:', signUpError);
  } else {
    console.log('Default user created successfully');
    console.log('Email:', DEFAULT_EMAIL);
    console.log('Password:', DEFAULT_PASSWORD);
  }
}

setupDefaultUser();

