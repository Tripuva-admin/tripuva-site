/*
  # Set up admin profile

  1. Changes
    - Ensure is_admin column exists
    - Create admin profile
  
  2. Security
    - Admin role properly set in profiles table
*/

-- First, ensure the profiles table has the is_admin column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create admin profile if it doesn't exist
INSERT INTO profiles (id, name, email, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Admin',
  'admin@tripuva.com',
  true
)
ON CONFLICT (id) DO UPDATE
SET is_admin = true;

-- Create policy for admin access
DROP POLICY IF EXISTS "Allow admin full access" ON profiles;
CREATE POLICY "Allow admin full access"
ON profiles
FOR ALL
TO authenticated
USING (is_admin = true)
WITH CHECK (is_admin = true);