/*
  # Update Packages Table Structure

  1. Changes
    - Drop existing packages table
    - Create new packages table with updated structure:
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (integer, in days)
      - `price` (numeric)
      - `group_size` (integer)
      - `image` (text)
      - `start_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Create policies for admin management and public reading
*/

-- Drop existing table
DROP TABLE IF EXISTS packages;

-- Create new packages table
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  price numeric NOT NULL CHECK (price >= 0),
  group_size integer NOT NULL CHECK (group_size > 0),
  image text NOT NULL,
  start_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
ON packages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admin full access"
ON packages FOR ALL
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

-- Insert sample data
INSERT INTO packages (
  title,
  description,
  duration,
  price,
  group_size,
  image,
  start_date
) VALUES
(
  'Mystical Rajasthan Adventure',
  'Explore the majestic forts and palaces of Rajasthan. Experience the rich cultural heritage, traditional cuisine, and vibrant local markets.',
  7,
  24999,
  12,
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200',
  '2024-04-15'
),
(
  'Kerala Backwaters Expedition',
  'Journey through the serene backwaters of Kerala. Stay in luxurious houseboats, enjoy Ayurvedic treatments, and discover local village life.',
  5,
  19999,
  8,
  'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1200',
  '2024-05-01'
),
(
  'Himalayan Mountain Retreat',
  'Experience the tranquility of the Himalayas. Trek through pristine trails, meditate in ancient monasteries, and enjoy breathtaking mountain views.',
  6,
  29999,
  10,
  'https://images.unsplash.com/photo-1626821608097-9c8f6760160c?auto=format&fit=crop&q=80&w=1200',
  '2024-06-10'
);