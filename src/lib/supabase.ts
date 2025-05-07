
import { createClient } from '@supabase/supabase-js';

// These should be environment variables in a production setup
const supabaseUrl = 'https://ifbsahjcokiyisqkwhtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYnNhaGpjb2tpeWlzcWt3aHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk5OTg2MDIsImV4cCI6MjAwNTU3NDYwMn0.jGpQk0h-TcYezFhPgcXEDJ36JXXrCyFzY7XVNibL3X8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          company_name: string;
          admin_email: string;
          license_start_date: string;
          license_end_date: string;
          is_active: boolean;
          admin_notified: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          company_name: string;
          admin_email: string;
          license_start_date?: string;
          license_end_date?: string;
          is_active?: boolean;
          admin_notified?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          company_name?: string;
          admin_email?: string;
          license_start_date?: string;
          license_end_date?: string;
          is_active?: boolean;
          admin_notified?: boolean;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          full_name: string;
          role: string;
          created_at: string;
          avatar_url?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_id: string;
          full_name: string;
          role?: string;
          created_at?: string;
          avatar_url?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_id?: string;
          full_name?: string;
          role?: string;
          created_at?: string;
          avatar_url?: string;
        };
      };
    };
  };
};
