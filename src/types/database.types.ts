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
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          license_start_date: string
          license_end_date: string
          is_active: boolean
          subscription_tier: string
          max_users: number
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          license_start_date: string
          license_end_date: string
          is_active?: boolean
          subscription_tier: string
          max_users: number
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          license_start_date?: string
          license_end_date?: string
          is_active?: boolean
          subscription_tier?: string
          max_users?: number
          settings?: Json
        }
      }
      users: {
        Row: {
          id: string
          email: string
          organization_id: string
          role: 'admin' | 'user' | 'superuser'
          created_at: string
          last_login: string
          settings: Json
        }
        Insert: {
          id?: string
          email: string
          organization_id: string
          role?: 'admin' | 'user' | 'superuser'
          created_at?: string
          last_login?: string
          settings?: Json
        }
        Update: {
          id?: string
          email?: string
          organization_id?: string
          role?: 'admin' | 'user' | 'superuser'
          created_at?: string
          last_login?: string
          settings?: Json
        }
      }
      licenses: {
        Row: {
          id: string
          organization_id: string
          start_date: string
          end_date: string
          status: 'active' | 'expired' | 'pending'
          payment_status: 'paid' | 'unpaid' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          start_date: string
          end_date: string
          status?: 'active' | 'expired' | 'pending'
          payment_status?: 'paid' | 'unpaid' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          start_date?: string
          end_date?: string
          status?: 'active' | 'expired' | 'pending'
          payment_status?: 'paid' | 'unpaid' | 'pending'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 