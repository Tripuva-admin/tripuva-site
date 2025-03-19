/*
  # Create test data for travel packages

  1. Test Data
    - Creates sample travel packages with existing agencies
    - Ensures no duplicate agency names
  
  2. Security
    - No changes to security policies
*/

-- First, let's get the existing agency IDs or create new ones if they don't exist
DO $$
DECLARE
  adventure_id uuid;
  heritage_id uuid;
  eco_id uuid;
BEGIN
  -- Try to get existing agencies first
  SELECT id INTO adventure_id FROM agencies WHERE name = 'Adventure Seekers' LIMIT 1;
  SELECT id INTO heritage_id FROM agencies WHERE name = 'Heritage Tours' LIMIT 1;
  SELECT id INTO eco_id FROM agencies WHERE name = 'Eco Explorers' LIMIT 1;

  -- If adventure_id doesn't exist, create it
  IF adventure_id IS NULL THEN
    INSERT INTO agencies (id, name, rating)
    VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Adventure Seekers', 4.8)
    RETURNING id INTO adventure_id;
  END IF;

  -- If heritage_id doesn't exist, create it
  IF heritage_id IS NULL THEN
    INSERT INTO agencies (id, name, rating)
    VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Heritage Tours', 4.5)
    RETURNING id INTO heritage_id;
  END IF;

  -- If eco_id doesn't exist, create it
  IF eco_id IS NULL THEN
    INSERT INTO agencies (id, name, rating)
    VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Eco Explorers', 4.7)
    RETURNING id INTO eco_id;
  END IF;

  -- Insert test packages using the correct agency IDs
  INSERT INTO packages (
    id,
    title,
    description,
    duration,
    price,
    group_size,
    image,
    start_date,
    agency_id
  )
  VALUES
    (
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      'Magical Manali Adventure',
      'Experience the breathtaking beauty of Manali with snow-capped peaks, lush valleys, and adventurous activities.',
      5,
      25000,
      15,
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23',
      '2024-04-15',
      adventure_id
    ),
    (
      'f47ac10b-58cc-4372-a567-0e02b2c3d480',
      'Goa Beach Retreat',
      'Discover the perfect blend of sun, sand, and culture in beautiful Goa. Enjoy beach activities and local cuisine.',
      4,
      20000,
      20,
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      '2024-04-20',
      heritage_id
    ),
    (
      'f47ac10b-58cc-4372-a567-0e02b2c3d481',
      'Kerala Backwaters Tour',
      'Explore the serene backwaters of Kerala, experience houseboat stays, and immerse in local culture.',
      6,
      30000,
      12,
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
      '2024-05-01',
      eco_id
    )
  ON CONFLICT (id) DO NOTHING;
END $$;