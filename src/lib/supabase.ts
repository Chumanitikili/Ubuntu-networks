import { createClient } from '@supabase/supabase-js';

// Update with correct credentials
const supabaseUrl = 'https://ifbsahjcokiyisqkwhtg.supabase.co';
// Using service role API key for admin access
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYnNhaGpjb2tpeWlzcWt3aHRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEyODc0OSwiZXhwIjoyMDYxNzA0NzQ5fQ.EEm3Btkcbno-RDcrCb4lxfEqj3ZgTAUBvQwsK7bOyUY';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
