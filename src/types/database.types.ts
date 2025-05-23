export interface Agency {
  id: string;
  name: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  package_id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  group_size: number;
  image: string;
  start_date: string;
  agency_id: string;
  status: 'open' | 'closed';
  booking_link: string;
  tags: string[];
  ranking: number;
  advance: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}