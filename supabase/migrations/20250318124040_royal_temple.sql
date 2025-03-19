/*
  # Add tags support to packages table

  1. Changes
    - Add `tags` column to packages table as text array
    - Update existing packages with sample tags
    - Add check constraint for valid tags

  2. Security
    - Maintain existing RLS policies
*/

-- Add tags column to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add check constraint for valid tags
ALTER TABLE packages
ADD CONSTRAINT valid_tags CHECK (
  tags <@ ARRAY[
    'Hill',
    'Beaches',
    'Wildlife',
    'Desert',
    'Heritage',
    'Urban',
    'Rural',
    'Trekking',
    'Road Trip',
    'Camping'
  ]::text[]
);

-- Update existing packages with sample tags
UPDATE packages 
SET tags = ARRAY['Heritage', 'Desert', 'Urban']
WHERE title ILIKE '%rajasthan%';

UPDATE packages 
SET tags = ARRAY['Beaches', 'Heritage', 'Urban']
WHERE title ILIKE '%goa%';

UPDATE packages 
SET tags = ARRAY['Hill', 'Trekking', 'Camping']
WHERE title ILIKE '%manali%' OR title ILIKE '%himalayan%';

UPDATE packages 
SET tags = ARRAY['Heritage', 'Urban', 'Rural']
WHERE title ILIKE '%varanasi%';

UPDATE packages 
SET tags = ARRAY['Hill', 'Wildlife', 'Trekking']
WHERE title ILIKE '%northeast%';

UPDATE packages 
SET tags = ARRAY['Hill', 'Desert', 'Trekking', 'Camping']
WHERE title ILIKE '%ladakh%';

UPDATE packages 
SET tags = ARRAY['Beaches', 'Rural', 'Heritage']
WHERE title ILIKE '%kerala%';