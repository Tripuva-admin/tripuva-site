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
  image_url: string;
  image?: string;
  itenary: string;
  start_date_2: Record<string, number>;
  location: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  tags: string[];
  advance: number;
  agency_id: string;
  package_id: string;
  booking_link: string;
  ranking: number;
  package_images?: Array<{ id: string; image_url: string; is_primary: boolean; }>;
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
  booking_id: string;
  booking_user_name: string;
  booking_user_email: string;
  booking_user_phone: string;
  booking_date: string;
  booking_package_start_date: string;
  booking_adv_status: 'pending' | 'paid' | 'failed';
  booking_rm_status: 'pending' | 'paid' | 'failed';
  booking_confirmation_status: 'pending' | 'confirmed' | 'cancelled';
  user_id: string;
  package_id: string;
  created_at: string;
  updated_at: string;
  package?: Package;
  profile?: Profile;
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

export interface destinations {
  id: string;
  dest_names: string;
}