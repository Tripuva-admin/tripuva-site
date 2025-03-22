/*
  # Fix Profile Policies
  
  1. Changes
    - Drop existing policies that are causing recursion
    - Create new simplified policies for user and admin access
  
  2. Security
    - Maintain RLS
    - Implement non-recursive policies for admin access
*/

-- Drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "Users can manage own profile"
ON profiles
TO authenticated
USING (
  auth.uid() = id OR 
  is_admin = true
)
WITH CHECK (
  auth.uid() = id OR 
  is_admin = true
);

CREATE POLICY "Users can read profiles"
ON profiles
TO authenticated
USING (true);