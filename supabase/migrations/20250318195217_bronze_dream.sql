/*
  # Fix profiles table RLS policies
  
  1. Changes:
    - Drop existing policies
    - Create new policies that allow:
      - Users to create their own profile
      - Users to read their own profile
      - Users to update their own profile
      - Admins to manage all profiles
  
  2. Security:
    - Maintain RLS protection
    - Allow profile creation during signup
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authentication" ON profiles;
DROP POLICY IF EXISTS "Enable select for individual profiles" ON profiles;
DROP POLICY IF EXISTS "Enable update for individual profiles" ON profiles;
DROP POLICY IF EXISTS "Enable delete for individual profiles" ON profiles;
DROP POLICY IF EXISTS "Enable full access for admins" ON profiles;

-- Create new policies

-- ✅ Allow users to insert their own profile during signup
CREATE POLICY "Enable insert for authentication"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ✅ Allow users to read their own profile OR admins to read all profiles
CREATE POLICY "Enable select for individual profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
);

-- ✅ Allow users to update their own profile
CREATE POLICY "Enable update for individual profiles"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ✅ Allow users to delete their own profile
CREATE POLICY "Enable delete for individual profiles"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ✅ Allow admins to have full access
CREATE POLICY "Enable full access for admins"
ON profiles FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
);
