# Backend API

This directory contains the serverless functions and setup for the backend API using Vercel and Supabase.

## Setup

1. **Environment Variables**: Ensure you have the following environment variables set:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

2. **Supabase Authentication**: Ensure your Supabase project is set up with authentication. You can manage users and authentication settings in the Supabase dashboard.

3. **Migrations and Seeders**:
   - Run migrations to set up the database schema:
     ```bash
     npm run migrate
     ```
   - Seed the database with initial data:
     ```bash
     npm run seed
     ```

4. **Running Locally**: Use Vercel CLI to run the serverless functions locally.

## Documentation

All functions are documented using JSDoc. Refer to the code comments for detailed information.
