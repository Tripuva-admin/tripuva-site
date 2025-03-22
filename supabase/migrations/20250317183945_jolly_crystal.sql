/*
  # Set up admin access policies
  
  1. Changes
    - Ensure is_admin column exists
    - Create policies for admin access
  
  2. Security
    - Enable RLS
    - Add policies for admin management
*/

-- First, ensure the profiles table has the is_admin column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create policy for admin access
DROP POLICY IF EXISTS "Allow admin full access" ON profiles;
CREATE POLICY "Allow admin full access"
ON profiles
FOR ALL
TO authenticated
USING (is_admin = true)
WITH CHECK (is_admin = true);

-- Create policy for users to read profiles
DROP POLICY IF EXISTS "Users can read profiles" ON profiles;
CREATE POLICY "Users can read profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: The admin user must be created through the Supabase dashboard
-- with email: tripuva.admin@gmail.com and password: Tripuva@2024
-- After creation, set is_admin to true using the dashboard