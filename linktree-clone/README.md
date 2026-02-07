# Linktree Clone - Full Stack Application

A beautiful, customizable Linktree-style link sharing platform with real-time admin controls.

## Features

✨ **Public View**
- Beautiful, animated link cards organized in sections
- Fully customizable colors and styling
- Profile image and bio
- Custom icons for each link
- Responsive design
- Real-time updates when admin makes changes

🔐 **Admin Panel**
- Secure password-protected access
- Live preview of changes
- Customize colors (background, text, buttons)
- Upload profile image
- Add/edit/delete sections
- Add/edit/delete links with custom icons
- Drag-and-drop ordering (visual indicators)
- Real-time synchronization with public view

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Styling**: Inline styles with custom animations

## Setup Instructions

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be fully set up

#### Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
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

-- Sections table
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  position integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Links table
CREATE TABLE links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  icon_url text,
  position integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_sections_profile_id ON sections(profile_id);
CREATE INDEX idx_links_section_id ON links(section_id);
CREATE INDEX idx_profiles_username ON profiles(username);
```

#### Create Storage Bucket for Images

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `images`
3. Make it public:
   - Click on the bucket
   - Go to Policies
   - Click "New Policy"
   - Select "For full customization, create a policy from scratch"
   - Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated uploads
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );
```

Or simply toggle "Public bucket" to ON.

#### Enable Realtime

1. Go to Database → Replication in Supabase
2. Enable replication for these tables:
   - `profiles`
   - `sections`
   - `links`

#### Create Your First Profile

Run this SQL to create a demo profile:

```sql
INSERT INTO profiles (username, admin_password, bio)
VALUES ('demo', 'admin123', 'Welcome to my links!');
```

### 2. Local Development Setup

#### Install Dependencies

```bash
cd linktree-clone
npm install
```

#### Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Get your Supabase credentials:
   - Go to Settings → API in your Supabase dashboard
   - Copy the Project URL and anon/public key

3. Update `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/demo` to see your site!
Visit `http://localhost:3000/demo/admin` to access admin panel (password: `admin123`)

### 3. Deployment

#### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

Your site will be live at `your-project.vercel.app`

#### Option B: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables in Site Settings
7. Deploy!

#### Option C: GitHub Pages

```bash
npm run build
# Deploy the 'dist' folder to GitHub Pages
```

## Creating Multiple Sites

Yes! You can deploy this app multiple times for different users. Each deployment shares the same Supabase database but serves different usernames.

### Method 1: Multiple Deployments
- Deploy the same code to different domains/subdomains
- Each person accesses their profile via `yoursite.com/their-username`

### Method 2: Separate Instances
- Clone the repository for each user
- Use the same Supabase project
- Deploy to different URLs
- Each site can have a different default username

### Method 3: Custom Domains
- Deploy once on Vercel/Netlify
- Add multiple custom domains
- Each domain can route to a different username using rewrites

Example Vercel `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/yourusername",
      "has": [
        {
          "type": "host",
          "value": "custom-domain.com"
        }
      ]
    }
  ]
}
```

## Usage Guide

### For End Users

1. Visit `yoursite.com/yourusername`
2. See your beautiful link page
3. To edit: Go to `yoursite.com/yourusername/admin`
4. Login with your password
5. Customize everything in the admin dashboard
6. Changes appear instantly on the public page!

### Creating a New User

Run this SQL in Supabase:

```sql
INSERT INTO profiles (username, admin_password, bio)
VALUES ('newuser', 'their-secure-password', 'Their bio text');
```

### Admin Features

**Profile Settings:**
- Upload profile image
- Edit bio
- Customize all colors (background, text, buttons)

**Sections & Links:**
- Create unlimited sections
- Add unlimited links per section
- Upload custom icons for each link
- Drag to reorder (visual feedback)
- Real-time preview

## File Structure

```
linktree-clone/
├── src/
│   ├── components/          # Reusable components
│   ├── config/
│   │   └── supabase.js     # Supabase client setup
│   ├── hooks/
│   │   └── useRealtimeProfile.js  # Real-time data hook
│   ├── pages/
│   │   ├── PublicView.jsx  # Public link page
│   │   ├── AdminLogin.jsx  # Admin login
│   │   └── AdminDashboard.jsx  # Admin panel
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point
├── public/
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## Customization

### Colors
The default theme uses a modern dark aesthetic:
- Background: `#0f0f23` (deep navy)
- Text: `#e8e8e8` (light gray)
- Buttons: `#1a1a2e` (dark slate)
- Button Text: `#ffffff` (white)

Change these in the admin panel or set defaults in the database.

### Fonts
Current font: DM Sans (loaded from Google Fonts)

To change: Edit the `@import` statement in the component files.

### Animations
All animations use CSS keyframes:
- `fadeInDown` - Header entrance
- `fadeInUp` - Staggered link appearance

Modify timing and easing in the inline styles.

## Security Notes

⚠️ **Important**: This is a basic implementation. For production:

1. **Password Hashing**: Currently stores plain text passwords. Use bcrypt:
```javascript
import bcrypt from 'bcryptjs'
const hashedPassword = await bcrypt.hash(password, 10)
```

2. **Rate Limiting**: Add rate limiting to prevent brute force attacks

3. **Input Validation**: Add proper validation for URLs and text inputs

4. **File Upload Validation**: Restrict file types and sizes

5. **Session Management**: Use proper JWT tokens instead of sessionStorage

6. **Row Level Security**: Enable RLS in Supabase:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Add appropriate policies
```

## Troubleshooting

### Images not uploading
- Check if storage bucket is public
- Verify bucket policies allow INSERT
- Check browser console for errors

### Real-time not working
- Enable replication in Supabase for all tables
- Check browser console for WebSocket errors
- Verify your Supabase URL is correct

### "Profile not found"
- Check if username exists in database
- Verify Supabase connection
- Check browser console for errors

### Deployment issues
- Ensure environment variables are set
- Check build logs for errors
- Verify Supabase URL is accessible from deployment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check browser console for errors

## License

MIT - Free to use and modify!

## Credits

Built with:
- React + Vite
- Supabase
- Lucide Icons
- Love ❤️

---

**Pro Tip**: Add this to your Instagram bio:
`🔗 yoursite.com/yourusername`

Enjoy your new link sharing platform! 🚀
