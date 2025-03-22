/*
  # Add tags to packages and update existing data

  1. Changes
    - Add tags column if it doesn't exist
    - Drop existing constraint if it exists
    - Add constraint for valid tags
    - Update existing packages with appropriate tags

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity with constraint
*/

-- Add tags column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'tags'
  ) THEN
    ALTER TABLE packages 
    ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Drop the constraint if it exists and recreate it
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'valid_tags'
    AND table_name = 'packages'
  ) THEN
    ALTER TABLE packages DROP CONSTRAINT valid_tags;
  END IF;
  
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
END $$;

-- Update existing packages with sample tags
UPDATE packages 
SET tags = ARRAY['Heritage', 'Desert', 'Urban']
WHERE title ILIKE '%rajasthan%'
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE packages 
SET tags = ARRAY['Beaches', 'Heritage', 'Urban']
WHERE title ILIKE '%goa%'
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE packages 
SET tags = ARRAY['Hill', 'Trekking', 'Camping']
WHERE (title ILIKE '%manali%' OR title ILIKE '%himalayan%')
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE packages 
SET tags = ARRAY['Heritage', 'Urban', 'Rural']
WHERE title ILIKE '%varanasi%'
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE packages 
SET tags = ARRAY['Hill', 'Wildlife', 'Trekking']
WHERE title ILIKE '%northeast%'
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE packages 
SET tags = ARRAY['Hill', 'Desert', 'Trekking', 'Camping']
WHERE title ILIKE '%ladakh%'
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE packages 
SET tags = ARRAY['Beaches', 'Rural', 'Heritage']
WHERE title ILIKE '%kerala%'
  AND (tags IS NULL OR array_length(tags, 1) IS NULL);

-- Set default tags for any remaining packages without tags
UPDATE packages
SET tags = ARRAY['Heritage', 'Urban']
WHERE tags IS NULL OR array_length(tags, 1) IS NULL;