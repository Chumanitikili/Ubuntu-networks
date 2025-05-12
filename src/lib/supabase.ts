import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Update with correct credentials
const supabaseUrl = 'https://ifbsahjcokiyisqkwhtg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getOrganizationSchema = (organizationId: string) => {
  return `org_${organizationId}`;
};

export const createOrganizationDatabase = async (organizationId: string) => {
  const schema = getOrganizationSchema(organizationId);
  
  // Create schema for organization
  const { error: schemaError } = await supabase.rpc('create_organization_schema', {
    schema_name: schema
  });
  
  if (schemaError) throw schemaError;
  
  return schema;
};

export const getOrganizationClient = (organizationId: string) => {
  const schema = getOrganizationSchema(organizationId);
  return supabase.schema(schema);
};

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          position: string;
          accountType: 'B2B' | 'B2C';
          status: 'active' | 'inactive' | 'lead';
          tags: string[];
          notes: string[];
          lastContact: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          position?: string;
          accountType: 'B2B' | 'B2C';
          status: 'active' | 'inactive' | 'lead';
          tags?: string[];
          notes?: string[];
          lastContact?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          position?: string;
          accountType?: 'B2B' | 'B2C';
          status?: 'active' | 'inactive' | 'lead';
          tags?: string[];
          notes?: string[];
          lastContact?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
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
