/*
  # Add status to packages table

  1. Changes
    - Add `status` column to `packages` table with values 'open' or 'closed'
    - Default value is 'open'
    - Add check constraint to ensure valid status values

  2. Security
    - Maintain existing RLS policies
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'status'
  ) THEN
    ALTER TABLE packages 
    ADD COLUMN status text NOT NULL DEFAULT 'open';

    ALTER TABLE packages 
    ADD CONSTRAINT packages_status_check 
    CHECK (status IN ('open', 'closed'));
  END IF;
END $$;