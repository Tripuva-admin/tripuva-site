/*
  # Insert Sample Travel Packages

  1. Changes
    - Insert diverse travel packages with realistic data
    - Packages cover different regions, themes, and price points
    - Each package includes high-quality Unsplash images
*/

INSERT INTO packages (
  title,
  description,
  duration,
  price,
  group_size,
  image,
  start_date
) VALUES
(
  'Mystical Rajasthan Heritage Tour',
  'Embark on a royal journey through Rajasthan''s most iconic cities. Explore magnificent forts, experience desert safaris, and immerse yourself in the rich cultural heritage. Visit Jaipur''s Amber Fort, Udaipur''s Lake Palace, and Jodhpur''s Mehrangarh Fort.',
  8,
  45999,
  15,
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200',
  '2024-05-15'
),
(
  'Kerala Backwaters & Wellness Retreat',
  'Experience the serene backwaters of Kerala on luxury houseboats. Enjoy traditional Ayurvedic treatments, visit spice plantations, and witness the famous Kathakali dance performances. Includes stays in eco-friendly resorts and authentic Kerala cuisine.',
  6,
  35999,
  12,
  'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1200',
  '2024-06-01'
),
(
  'Himalayan Adventure Expedition',
  'Trek through the breathtaking Himalayan trails of Himachal Pradesh. Experience camping under the stars, river rafting in Kullu, and meditation sessions in ancient monasteries. Perfect for adventure enthusiasts and nature lovers.',
  7,
  42999,
  10,
  'https://images.unsplash.com/photo-1626821608097-9c8f6760160c?auto=format&fit=crop&q=80&w=1200',
  '2024-05-20'
),
(
  'Golden Triangle Cultural Discovery',
  'Discover India''s famous Golden Triangle: Delhi, Agra, and Jaipur. Visit the iconic Taj Mahal, explore bustling bazaars, and experience the perfect blend of historical monuments and modern Indian culture.',
  5,
  32999,
  20,
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200',
  '2024-06-10'
),
(
  'Goa Beach & Heritage Escape',
  'Unwind on Goa''s pristine beaches and explore its Portuguese heritage. Visit ancient churches, spice plantations, and enjoy water sports. Experience the vibrant nightlife and famous Goan cuisine.',
  4,
  28999,
  16,
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
  '2024-07-01'
),
(
  'Varanasi Spiritual Journey',
  'Experience the spiritual heart of India in Varanasi. Witness the mesmerizing Ganga Aarti, explore ancient temples, and take boat rides on the holy Ganges. Includes meditation sessions and cultural performances.',
  4,
  25999,
  12,
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1200',
  '2024-06-15'
),
(
  'Northeast India Wildlife Safari',
  'Explore the rich biodiversity of Northeast India. Visit Kaziranga National Park, home to one-horned rhinoceros. Experience tribal culture, tea plantations, and the unique cuisine of the region.',
  6,
  38999,
  8,
  'https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&q=80&w=1200',
  '2024-07-10'
),
(
  'Ladakh Mountain Expedition',
  'Journey through the stunning landscapes of Ladakh. Visit ancient Buddhist monasteries, Pangong Lake, and experience the unique culture of the Himalayas. Perfect for photography enthusiasts.',
  8,
  48999,
  10,
  'https://images.unsplash.com/photo-1593939535589-8356e421b3cc?auto=format&fit=crop&q=80&w=1200',
  '2024-08-01'
);