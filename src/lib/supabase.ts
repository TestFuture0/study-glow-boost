
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ggvcybeqifzdfivxstua.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndmN5YmVxaWZ6ZGZpdnhzdHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzgxNzMsImV4cCI6MjA2MzI1NDE3M30.xJAl27xjhdHeKWlLuQw-3x7C_8a7HaVtxtMUqXVgT0U';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a type declaration for the Supabase database schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          points: number;
          last_active: string;
          created_at?: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          points?: number;
          last_active?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          points?: number;
          last_active?: string;
        };
      };
    };
  };
};
