/*
  # Fix admin login functionality
  
  1. Changes
    - Ensure admin user exists in profiles table
    - Set admin flag correctly
  
  2. Security
    - Maintain RLS policies
    - Only update specific admin user
*/

-- First, ensure the profiles table has the is_admin column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update the admin profile's is_admin flag
UPDATE profiles
SET is_admin = true
WHERE email = 'tripuva.admin@gmail.com';

-- Ensure proper policies are in place
DROP POLICY IF EXISTS "Allow admin full access" ON profiles;
CREATE POLICY "Allow admin full access"
ON profiles
FOR ALL
TO authenticated
USING (is_admin = true)
WITH CHECK (is_admin = true);

DROP POLICY IF EXISTS "Users can read profiles" ON profiles;
CREATE POLICY "Users can read profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Add policy for admin to manage all tables
DROP POLICY IF EXISTS "Allow admin full access" ON packages;
CREATE POLICY "Allow admin full access"
ON packages
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
));

DROP POLICY IF EXISTS "Allow admin full access" ON agencies;
CREATE POLICY "Allow admin full access"
ON agencies
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
));

DROP POLICY IF EXISTS "Allow admin full access" ON package_images;
CREATE POLICY "Allow admin full access"
ON package_images
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
));