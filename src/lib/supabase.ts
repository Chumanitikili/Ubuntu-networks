
import { createClient } from '@supabase/supabase-js';

// Update with correct credentials
const supabaseUrl = 'https://ifbsahjcokiyisqkwhtg.supabase.co';
// This is the actual project API key that needs to be corrected
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYnNhaGpjb2tpeWlzcWt3aHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMTA2NTIsImV4cCI6MjAzMDY4NjY1Mn0.sYK6vUQf5IoKH2kuqExcq0SN4p5VJ_V_EqLEo9BI8HQ';

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
