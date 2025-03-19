/*
  # Remove Admin Functionality
  
  1. Changes
    - Drop existing policies that depend on is_admin column
    - Remove is_admin column from profiles table
    - Create new simplified policies
  
  2. Security
    - Maintain basic RLS policies for user data protection
    - Users can only access their own profiles
*/

-- First drop the existing policies that depend on the is_admin column
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Now we can safely remove the is_admin column
ALTER TABLE profiles DROP COLUMN IF EXISTS is_admin;

-- Create new simplified policies
CREATE POLICY "Allow users to insert own profile"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);