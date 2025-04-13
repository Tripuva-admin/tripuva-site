/*
  # Add ranking and advance columns to packages table

  1. Changes
    - Add `ranking` column (integer, 1-10000)
    - Add `advance` column (numeric)
    - Add `itenary` column (text)
    - Update existing packages with random values
    - Add check constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS ranking integer DEFAULT 1000,
ADD COLUMN IF NOT EXISTS advance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS itenary text;

-- Add check constraints
ALTER TABLE packages
ADD CONSTRAINT check_ranking_range 
CHECK (ranking BETWEEN 1 AND 10000);

ALTER TABLE packages
ADD CONSTRAINT check_advance_positive 
CHECK (advance >= 0);

-- Update existing packages with random values
UPDATE packages 
SET 
  ranking = floor(random() * 10000) + 1,
  advance = floor(random() * 10000) * 100;

-- Order packages by ranking by default
CREATE INDEX IF NOT EXISTS packages_ranking_idx ON packages (ranking DESC);