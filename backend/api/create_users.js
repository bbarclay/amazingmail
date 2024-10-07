import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/workspace/.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create a user
async function createUser(userData) {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return null;
  }

  // If user creation is successful, insert additional user data into the users table
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .insert([
      {
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        organization_id: userData.organization_id,
        role: userData.role,
        phone_number: userData.phone_number,
        profile_picture: userData.profile_picture,
      },
    ]);

  if (profileError) {
    console.error('Error inserting user profile data:', profileError.message);
    return null;
  }

  console.log('User created successfully:', data.user.id);
  return data.user;
}

// Example usage
async function main() {
  const newUser = {
    email: 'test@example.com',
    password: 'securepassword123',
    name: 'Test User',
    organization_id: '00000000-0000-0000-0000-000000000000', // Replace with actual organization ID
    role: 'user',
    phone_number: '+1234567890',
    profile_picture: 'https://example.com/profile.jpg',
  };

  const createdUser = await createUser(newUser);
  if (createdUser) {
    console.log('User created:', createdUser);
  } else {
    console.log('Failed to create user');
  }
}

main().catch(console.error);

