/*
  # Add admin functionality
  
  1. Changes
    - Add `is_admin` column to profiles table
    - Add policy for admin access
  
  2. Security
    - Enable RLS for admin access
    - Add policy for admin users to have full access
*/

-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update existing policies to allow admin access
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Create new policies that include admin access
CREATE POLICY "Allow users to insert own profile"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT 
TO authenticated 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
)
WITH CHECK (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);