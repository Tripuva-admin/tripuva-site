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
  start_date: string | string[];
  start_date_2?: { [key: string]: number };
  agency_id: string;
  status: 'open' | 'closed';
  booking_link?: string;
  tags?: string[];
  ranking: number;
  advance: number;
  created_at: string;
  updated_at: string;
  agency?: {
    name: string;
    rating: number;
  };
  package_images?: {
    id: string;
    image_url: string;
    is_primary: boolean;
  }[];
  listings?: {
    id: string;
    start_date: string;
  }[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  status: string;
  booking_date: Date;
  number_of_people: number;
  total_price: number;
}

export interface Config {
  id: string;
  config_key: string;
  config_value: string;
  created_at?: string;
}

export interface tags {
  id: string;
  tag_name: string;
  created_at?: string;
}