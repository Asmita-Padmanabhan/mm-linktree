import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Table schemas for reference:
/*
  CREATE TABLE profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username text UNIQUE NOT NULL,
    admin_password text NOT NULL,
    background_color text DEFAULT '#0f0f23',
    text_color text DEFAULT '#e8e8e8',
    button_color text DEFAULT '#1a1a2e',
    button_text_color text DEFAULT '#ffffff',
    profile_image text,
    bio text,
    created_at timestamp with time zone DEFAULT now()
  );

  CREATE TABLE sections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    position integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
  );

  CREATE TABLE links (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
    title text NOT NULL,
    url text NOT NULL,
    icon_url text,
    position integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
  );
*/
