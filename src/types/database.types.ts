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
  duration: string;
  group_size: string;
  image_url: string[];
  itenary?: string;
  start_date_2: { [key: string]: number };
  location: string;
  ranking?: number;
  advance?: number;
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