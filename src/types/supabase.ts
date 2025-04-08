export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          package_id: string
          title: string
          description: string
          duration: number
          price: number
          group_size: number
          image: string
          start_date: string[]
          agency_id: string | null
          status: 'open' | 'closed'
          booking_link: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id?: string
          title: string
          description: string
          duration: number
          price: number
          group_size: number
          image: string
          start_date: string[]
          agency_id?: string | null
          status?: 'open' | 'closed'
          booking_link?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          title?: string
          description?: string
          duration?: number
          price?: number
          group_size?: number
          image?: string
          start_date?: string[]
          agency_id?: string | null
          status?: 'open' | 'closed'
          booking_link?: string
          created_at?: string
          updated_at?: string
        }
      }
      package_images: {
        Row: {
          id: string
          package_id: string | null
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          package_id?: string | null
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string | null
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          package_id: string
          user_id: string
          booking_date: string
          number_of_people: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id: string
          user_id: string
          booking_date: string
          number_of_people: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          user_id?: string
          booking_date?: string
          number_of_people?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      config: {
        Row: {
          id: string;
          config_key: string;
          config_value: string;
          created_at: string;
        }
        Insert: {
          id?: string;
          config_key: string;
          config_value: string;
          created_at?: string;
        }
        Update: {
          id?: string;
          config_key?: string;
          config_value?: string;
          created_at?: string;
        }
      }
      tags: {
        Row: {
          id: string;
          tag_name: string;
          created_at: string;
        }
        Insert: {
          id?: string;
          tag_name: string;
          created_at?: string;
        }
        Update: {
          id?: string;
          tag_name?: string;
          created_at?: string;
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}