/*
  # Add Package ID and Update Booking Link

  1. Changes
    - Add `package_id` column to packages table
    - Generate unique 6-digit IDs for existing packages
    - Update booking links to include package IDs
    - Add trigger for automatic package ID generation

  2. Security
    - Maintain existing RLS policies
    - Ensure unique constraint on package_id
*/

-- Add package_id column
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS package_id text UNIQUE;

-- Create sequence for package IDs
CREATE SEQUENCE IF NOT EXISTS package_id_seq
  START WITH 100000
  INCREMENT BY 1
  NO MAXVALUE
  MINVALUE 100000
  CACHE 1;

-- Generate package IDs for existing packages
UPDATE packages 
SET package_id = LPAD(nextval('package_id_seq')::text, 6, '0')
WHERE package_id IS NULL;

-- Make package_id NOT NULL after updating existing records
ALTER TABLE packages 
ALTER COLUMN package_id SET NOT NULL;

-- Create function to generate package ID and booking link
CREATE OR REPLACE FUNCTION generate_package_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate package_id if not provided
  IF NEW.package_id IS NULL THEN
    NEW.package_id := LPAD(nextval('package_id_seq')::text, 6, '0');
  END IF;
  
  -- Generate booking link
  NEW.booking_link := 'https://wa.me/919395929602?text=Hi,%20I%20want%20to%20book%20the%20trip%20to%20' || 
    REPLACE(NEW.title, ' ', '%20') ||
    '%20(Package%20ID:%20' || NEW.package_id || ')';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate package ID and booking link
DROP TRIGGER IF EXISTS set_package_details ON packages;
CREATE TRIGGER set_package_details
  BEFORE INSERT ON packages
  FOR EACH ROW
  EXECUTE FUNCTION generate_package_details();

-- Update booking links for existing packages to include package ID
UPDATE packages 
SET booking_link = 'https://wa.me/919395929602?text=Hi,%20I%20want%20to%20book%20the%20trip%20to%20' || 
  REPLACE(title, ' ', '%20') ||
  '%20(Package%20ID:%20' || package_id || ')';