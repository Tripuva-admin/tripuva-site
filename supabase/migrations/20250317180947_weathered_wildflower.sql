/*
  # Update WhatsApp Booking Link Format

  1. Changes
    - Update the booking link format for all packages
    - Update the trigger function to use the new format
    - Ensure package_id is included in the link

  2. Security
    - No security changes needed
    - Maintains existing RLS policies
*/

-- Update the function that generates the booking link
CREATE OR REPLACE FUNCTION generate_package_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate package_id if not provided
  IF NEW.package_id IS NULL THEN
    NEW.package_id := LPAD(nextval('package_id_seq')::text, 6, '0');
  END IF;
  
  -- Generate booking link with new format
  NEW.booking_link := 'https://wa.me/919395929602?text=Hi,%20I%20want%20to%20book%20the%20trip%20to%20' || 
    REPLACE(NEW.title, ' ', '%20') ||
    '%20' || NEW.package_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update booking links for existing packages with new format
UPDATE packages 
SET booking_link = 'https://wa.me/919395929602?text=Hi,%20I%20want%20to%20book%20the%20trip%20to%20' || 
  REPLACE(title, ' ', '%20') ||
  '%20' || package_id;