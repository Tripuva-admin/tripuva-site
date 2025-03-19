/*
  # Create Bookings Table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `package_id` (uuid, foreign key to packages)
      - `user_id` (uuid, foreign key to profiles)
      - `booking_date` (date)
      - `number_of_people` (integer)
      - `total_price` (numeric)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on bookings table
    - Add policies for users to manage their own bookings
    - Add policies for admins to manage all bookings
*/

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_date date NOT NULL,
  number_of_people integer NOT NULL CHECK (number_of_people > 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to create their own bookings
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for admins to manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON bookings
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );