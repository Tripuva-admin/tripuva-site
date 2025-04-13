export interface Agency {
  id: string;
  name: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  group_size: number;
  image_url: string | string[];
  itenary: string;
  start_date_2: Record<string, number>;
  location: string;
  status: string;
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