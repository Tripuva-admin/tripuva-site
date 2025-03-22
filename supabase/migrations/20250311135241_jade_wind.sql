/*
  # Add package images support

  1. New Tables
    - `package_images`
      - `id` (uuid, primary key)
      - `package_id` (uuid, foreign key)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `is_primary` (boolean)

  2. Security
    - Enable RLS on `package_images` table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS package_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE package_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin full access to package images"
  ON package_images
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));

CREATE POLICY "Allow public read access to package images"
  ON package_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Migrate existing package images
INSERT INTO package_images (package_id, image_url, is_primary)
SELECT id, image, true
FROM packages;