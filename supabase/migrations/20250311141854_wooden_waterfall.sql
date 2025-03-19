/*
  # Add sample package images

  1. Changes
    - Insert sample images for existing packages
    - Each package will have 3-6 images
    - One image per package will be marked as primary

  2. Notes
    - Uses real, existing Unsplash images
    - Maintains data consistency with existing packages
*/

-- Insert sample images for packages
DO $$
DECLARE
    package_record RECORD;
BEGIN
    FOR package_record IN SELECT id FROM packages
    LOOP
        -- Goa Package Images
        IF EXISTS (SELECT 1 FROM packages WHERE id = package_record.id AND title ILIKE '%goa%') THEN
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1581274050302-581149d3b4eb?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80', false);
        
        -- Manali Package Images
        ELSIF EXISTS (SELECT 1 FROM packages WHERE id = package_record.id AND title ILIKE '%manali%') THEN
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1591649016789-45f1ecbb7da4?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1593181629218-9598ca83829b?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1593181629218-9598ca83829b?auto=format&fit=crop&q=80', false);

        -- Kerala Package Images
        ELSIF EXISTS (SELECT 1 FROM packages WHERE id = package_record.id AND title ILIKE '%kerala%') THEN
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1580392242573-5c7c5138c03e?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1609771100472-d5f5b7cb9788?auto=format&fit=crop&q=80', false);

        -- Rajasthan Package Images
        ELSIF EXISTS (SELECT 1 FROM packages WHERE id = package_record.id AND title ILIKE '%rajasthan%') THEN
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1586793768670-d87ef6d5d1c7?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1573480813647-552e9b7b5394?auto=format&fit=crop&q=80', false);

        -- Ladakh Package Images
        ELSIF EXISTS (SELECT 1 FROM packages WHERE id = package_record.id AND title ILIKE '%ladakh%') THEN
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1621604474789-a129469e8bd8?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1619837374214-f5b9eb80876d?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1624890240392-dec540a8d8f9?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1619837374214-f5b9eb80876d?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?auto=format&fit=crop&q=80', false);

        -- Varanasi Package Images
        ELSIF EXISTS (SELECT 1 FROM packages WHERE id = package_record.id AND title ILIKE '%varanasi%') THEN
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1627894006066-b45796ead2b5?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1619837374214-f5b9eb80876d?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&q=80', false);

        -- Default Package Images (for any other packages)
        ELSE
            INSERT INTO package_images (package_id, image_url, is_primary) VALUES
                (package_record.id, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80', true),
                (package_record.id, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80', false),
                (package_record.id, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80', false);
        END IF;
    END LOOP;
END $$;