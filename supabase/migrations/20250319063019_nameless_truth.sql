/*
  # Remove bookings table and related functionality
  
  1. Changes
    - Drop bookings table
    - Remove related foreign keys and constraints
  
  2. Security
    - No security changes needed
*/

-- Drop the bookings table if it exists
DROP TABLE IF EXISTS bookings;