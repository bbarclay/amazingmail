import { supabase } from '../lib/supabaseClient';

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

