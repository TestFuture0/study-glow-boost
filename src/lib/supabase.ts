
import { createClient } from '@supabase/supabase-js';

// Use default values for development when environment variables aren't available
// These will be replaced with actual values from Lovable's environment variables when deployed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

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
