/*
  # Fix RLS policies for profiles table

  1. Changes
    - Drop existing policies
    - Add new policies that properly handle:
      - Profile creation during signup
      - Reading own profile
      - Admin access to all profiles
      - Profile updates

  2. Security
    - Enable RLS
    - Add comprehensive policies for all required operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users to own profile"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Enable update for users to own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);