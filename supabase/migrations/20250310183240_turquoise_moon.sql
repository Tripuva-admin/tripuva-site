/*
  # Add sample data for bookings and agencies

  1. Sample Data
    - Add sample agencies with ratings
    - Add sample bookings with various statuses
    - Link bookings to existing packages and users
*/

-- Sample agencies data
INSERT INTO agencies (id, name, rating) VALUES
  ('d1c3b2a4-e5f6-4a3b-8c9d-0e1f2a3b4c5d', 'Himalayan Expeditions', 4.8),
  ('b2a3c4d5-f6e7-8b9a-0c1d-2e3f4a5b6c7d', 'Kerala Backwaters Tours', 4.9),
  ('e5f6a7b8-c9d0-4e1f-8a3b-4c5d6e7f8a9b', 'Rajasthan Heritage Travels', 4.7),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Golden Triangle Adventures', 4.6),
  ('f6e5d4c3-b2a1-9f8e-7d6c-5b4a3c2d1e0f', 'Goa Beach Holidays', 4.5)
ON CONFLICT (id) DO NOTHING;

-- Update packages to link with agencies using subqueries
UPDATE packages 
SET agency_id = 'd1c3b2a4-e5f6-4a3b-8c9d-0e1f2a3b4c5d'
WHERE id IN (
  SELECT id 
  FROM packages 
  WHERE agency_id IS NULL 
  ORDER BY created_at 
  FETCH FIRST 2 ROWS ONLY
);

UPDATE packages 
SET agency_id = 'b2a3c4d5-f6e7-8b9a-0c1d-2e3f4a5b6c7d'
WHERE id IN (
  SELECT id 
  FROM packages 
  WHERE agency_id IS NULL 
  ORDER BY created_at 
  FETCH FIRST 2 ROWS ONLY
);

UPDATE packages 
SET agency_id = 'e5f6a7b8-c9d0-4e1f-8a3b-4c5d6e7f8a9b'
WHERE id IN (
  SELECT id 
  FROM packages 
  WHERE agency_id IS NULL 
  ORDER BY created_at 
  FETCH FIRST 2 ROWS ONLY
);

-- Sample bookings data
DO $$ 
DECLARE 
  package_id uuid;
  user_id uuid;
BEGIN
  -- Get a package ID
  SELECT id INTO package_id FROM packages LIMIT 1;
  
  -- Get a user ID
  SELECT id INTO user_id FROM profiles LIMIT 1;
  
  IF package_id IS NOT NULL AND user_id IS NOT NULL THEN
    -- Insert sample bookings
    INSERT INTO bookings (
      id,
      package_id,
      user_id,
      booking_date,
      number_of_people,
      total_price,
      status,
      created_at
    ) VALUES 
      (
        'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        package_id,
        user_id,
        CURRENT_DATE + INTERVAL '30 days',
        2,
        25000,
        'confirmed',
        NOW() - INTERVAL '5 days'
      ),
      (
        'b2c3d4e5-f6e7-4a7b-8c9d-1e2f3a4b5c6d',
        package_id,
        user_id,
        CURRENT_DATE + INTERVAL '45 days',
        4,
        48000,
        'pending',
        NOW() - INTERVAL '2 days'
      ),
      (
        'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        package_id,
        user_id,
        CURRENT_DATE + INTERVAL '60 days',
        1,
        12000,
        'cancelled',
        NOW() - INTERVAL '10 days'
      ),
      (
        'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        package_id,
        user_id,
        CURRENT_DATE + INTERVAL '15 days',
        3,
        36000,
        'confirmed',
        NOW() - INTERVAL '7 days'
      ),
      (
        'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        package_id,
        user_id,
        CURRENT_DATE + INTERVAL '90 days',
        2,
        24000,
        'pending',
        NOW() - INTERVAL '1 day'
      )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;