-- ====================================
-- SUPABASE DATABASE SETUP
-- Run this in your Supabase SQL Editor
-- ====================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- CREATE TABLES
-- ====================================

-- Profiles table (main user profiles)
CREATE TABLE IF NOT EXISTS profiles (
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

-- Sections table (link sections)
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Links table (individual links)
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  icon_url text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- ====================================
-- CREATE INDEXES
-- ====================================

CREATE INDEX IF NOT EXISTS idx_sections_profile_id ON sections(profile_id);
CREATE INDEX IF NOT EXISTS idx_sections_position ON sections(position);
CREATE INDEX IF NOT EXISTS idx_links_section_id ON links(section_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ====================================
-- INSERT DEMO DATA (Optional)
-- ====================================

-- Create a demo profile
INSERT INTO profiles (username, admin_password, bio, background_color, text_color, button_color, button_text_color)
VALUES (
  'demo',
  'admin123',
  'Welcome to my link hub! 🚀',
  '#0f0f23',
  '#e8e8e8',
  '#1a1a2e',
  '#ffffff'
) ON CONFLICT (username) DO NOTHING;

-- Get the demo profile ID
DO $$
DECLARE
  demo_profile_id uuid;
  social_section_id uuid;
  projects_section_id uuid;
BEGIN
  -- Get profile ID
  SELECT id INTO demo_profile_id FROM profiles WHERE username = 'demo';
  
  -- Create sections
  INSERT INTO sections (profile_id, title, position)
  VALUES (demo_profile_id, 'Social Media', 0)
  RETURNING id INTO social_section_id;
  
  INSERT INTO sections (profile_id, title, position)
  VALUES (demo_profile_id, 'My Projects', 1)
  RETURNING id INTO projects_section_id;
  
  -- Add links to Social Media section
  INSERT INTO links (section_id, title, url, position)
  VALUES 
    (social_section_id, 'Instagram', 'https://instagram.com', 0),
    (social_section_id, 'Twitter', 'https://twitter.com', 1),
    (social_section_id, 'LinkedIn', 'https://linkedin.com', 2);
  
  -- Add links to Projects section
  INSERT INTO links (section_id, title, url, position)
  VALUES 
    (projects_section_id, 'My Portfolio', 'https://example.com', 0),
    (projects_section_id, 'GitHub', 'https://github.com', 1);
END $$;

-- ====================================
-- ENABLE ROW LEVEL SECURITY (Optional but Recommended)
-- ====================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Allow public read access on profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on sections"
  ON sections FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on links"
  ON links FOR SELECT
  USING (true);

-- Allow authenticated users to manage their own profiles
-- Note: You'll need to implement proper authentication for production
CREATE POLICY "Allow users to update their profile"
  ON profiles FOR UPDATE
  USING (true);  -- Replace with proper auth check in production

CREATE POLICY "Allow users to manage sections"
  ON sections FOR ALL
  USING (true);  -- Replace with proper auth check in production

CREATE POLICY "Allow users to manage links"
  ON links FOR ALL
  USING (true);  -- Replace with proper auth check in production

-- ====================================
-- STORAGE BUCKET POLICIES
-- ====================================

-- After creating the 'images' bucket in Supabase Storage UI, run:

-- Allow public read access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow anyone to upload images (restrict this in production!)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Allow updates and deletes
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );

CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- ====================================
-- SETUP COMPLETE!
-- ====================================

-- Check your data:
SELECT * FROM profiles;
SELECT * FROM sections;
SELECT * FROM links;

-- Test URLs:
-- Public: http://localhost:3000/demo
-- Admin: http://localhost:3000/demo/admin (password: admin123)
