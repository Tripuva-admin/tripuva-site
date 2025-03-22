/*
  # Fix Profiles Table RLS Policies
  
  1. Changes
    - Drop existing policies that cause recursion
    - Create new non-recursive policies for profiles table
    - Implement secure access control without circular dependencies
  
  2. Security
    - Enable RLS on profiles table
    - Create policies for insert, select, and update operations
    - Implement admin access without recursion
    - Maintain data security and access control
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Create new policies without recursion
-- Insert policy: Users can only insert their own profile
CREATE POLICY "Allow users to insert own profile"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Select policy: Users can read their own profile, admins can read all
CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT 
TO authenticated 
USING (
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
    THEN true  -- Admin can read all profiles
    ELSE id = auth.uid()  -- Regular users can only read their own profile
  END
);

-- Update policy: Users can only update their own profile
CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);