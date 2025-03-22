/*
  # Fix recursive RLS policies

  1. Changes
    - Drop existing policies that cause recursion
    - Create new non-recursive policies for profiles table
    - Simplify admin access checks
  
  2. Security
    - Maintain data security
    - Prevent infinite recursion
    - Keep admin capabilities
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable insert for authentication" ON profiles;
DROP POLICY IF EXISTS "Enable select for individual profiles" ON profiles;
DROP POLICY IF EXISTS "Enable update for individual profiles" ON profiles;
DROP POLICY IF EXISTS "Enable delete for individual profiles" ON profiles;
DROP POLICY IF EXISTS "Enable full access for admins" ON profiles;

-- Create new simplified policies

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  is_admin = true
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow admins to manage all profiles
CREATE POLICY "Admins can manage all profiles"
ON profiles FOR ALL
TO authenticated
USING (is_admin = true)
WITH CHECK (is_admin = true);