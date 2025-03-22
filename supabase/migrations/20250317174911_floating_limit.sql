/*
  # Add booking link to packages table

  1. Changes
    - Add `booking_link` column to packages table
    - Update existing packages with WhatsApp booking links
    - Remove sign-in requirement for bookings
*/

-- Add booking_link column to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS booking_link text;

-- Update existing packages with WhatsApp booking links
UPDATE packages 
SET booking_link = 'https://wa.me/919395929602?text=Hi,%20I%20want%20to%20book%20the%20trip%20to%20' || 
REPLACE(title, ' ', '%20');