/*
  # Create Packages Table and Sample Data

  1. New Tables
    - `packages`
      - `id` (uuid, primary key)
      - `city` (text)
      - `image_url` (text)
      - `agency` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `price` (numeric)
      - `spots` (integer)
      - `description` (text)
      - `rating` (numeric)
      - `category` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references profiles)

  2. Security
    - Enable RLS on packages table
    - Create policies for admin management and public reading
*/

-- Create packages table
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  image_url text NOT NULL,
  agency text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  spots integer NOT NULL CHECK (spots >= 0),
  description text NOT NULL,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
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
  city,
  image_url,
  agency,
  start_date,
  end_date,
  price,
  spots,
  description,
  rating,
  category,
  created_by
) VALUES
(
  'Jaipur',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200',
  'Pink City Adventures',
  '2024-03-15',
  '2024-03-20',
  24999,
  8,
  'Explore the majestic Pink City with fellow travelers. Visit Amber Fort, City Palace, and experience local culture.',
  4.8,
  'Heritage',
  (SELECT id FROM profiles WHERE is_admin = true LIMIT 1)
),
(
  'Varanasi',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1200',
  'Spiritual Journeys',
  '2024-04-05',
  '2024-04-10',
  19999,
  6,
  'Experience the spiritual heart of India. Witness the Ganga Aarti and explore ancient temples.',
  4.9,
  'Spiritual',
  (SELECT id FROM profiles WHERE is_admin = true LIMIT 1)
),
(
  'Kerala Backwaters',
  'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1200',
  'Kerala Explorers',
  '2024-05-01',
  '2024-05-06',
  32999,
  8,
  'Cruise through serene backwaters, experience houseboat stays, and enjoy authentic Kerala cuisine.',
  4.9,
  'Nature',
  (SELECT id FROM profiles WHERE is_admin = true LIMIT 1)
);