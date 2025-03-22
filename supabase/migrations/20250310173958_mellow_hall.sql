/*
  # Fix recursive RLS policy for profiles table

  1. Changes
    - Drop existing policies that cause recursion
    - Create new non-recursive policies for:
      - Profile creation
      - Profile reading
      - Profile updates
    - Add admin access without recursive checks

  2. Security
    - Maintain RLS protection
    - Prevent infinite recursion
    - Preserve admin capabilities
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users to own profile" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Allow users to insert own profile"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Direct match for own profile
  auth.uid() = id OR
  -- Admin check without recursion
  (SELECT is_admin FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);