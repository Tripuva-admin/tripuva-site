/*
  # Add agencies table and update packages

  1. New Tables
    - `agencies`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `rating` (numeric, 0-5 with one decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add `agency_id` to `packages` table as foreign key

  3. Security
    - Enable RLS on `agencies` table
    - Add policies for:
      - Public read access to agencies
      - Admin-only write access
*/

-- Create agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add agency_id to packages
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS agency_id uuid REFERENCES agencies(id);

-- Enable RLS
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- Policies for agencies
CREATE POLICY "Allow public read access to agencies"
  ON agencies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin full access to agencies"
  ON agencies
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

-- Add some sample agencies
INSERT INTO agencies (name, rating) VALUES
  ('Pink City Adventures', 4.8),
  ('Spiritual Journeys', 4.9),
  ('Royal Rajasthan Tours', 4.7),
  ('Adventure Seekers', 4.6),
  ('Kerala Explorers', 4.9);