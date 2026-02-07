# 🚀 Quick Start Guide - Get Your Link Site Running in 10 Minutes!

## What You're Getting

A fully functional Linktree clone with:
- ✅ Beautiful animated public link page
- ✅ Password-protected admin panel  
- ✅ Real-time updates (changes show instantly!)
- ✅ Custom colors, icons, and sections
- ✅ Image uploads
- ✅ Mobile responsive
- ✅ Free to deploy!

## Step 1: Supabase Setup (3 minutes)

### Create Account & Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest)
4. Click "New Project"
5. Fill in:
   - Name: `my-linktree` (or anything)
   - Database Password: Generate a strong one
   - Region: Choose closest to you
6. Click "Create new project"
7. ⏳ Wait 2-3 minutes for setup to complete

### Setup Database
1. Click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the `supabase-setup.sql` file from this project
4. Copy ALL the SQL code
5. Paste it into the Supabase query editor
6. Click "Run" (or press Cmd+Enter / Ctrl+Enter)
7. You should see "Success. No rows returned" - that's good! ✅

### Setup Storage
1. Click "Storage" in the left sidebar
2. Click "New bucket"
3. Name it `images`
4. Toggle "Public bucket" to ON
5. Click "Create bucket"

### Enable Realtime
1. Click "Database" → "Replication" in the left sidebar
2. Find these tables and toggle them ON:
   - `profiles`
   - `sections`
   - `links`

### Get Your API Keys
1. Click "Settings" → "API" in the left sidebar
2. Copy these two values (you'll need them soon):
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string of random characters)

## Step 2: Local Development (2 minutes)

### Install Node.js (if you don't have it)
- Download from: https://nodejs.org
- Install the LTS version
- Verify: Open terminal and type `node -v` (should show version number)

### Setup Project
1. Open terminal/command prompt
2. Navigate to the project folder:
   ```bash
   cd path/to/linktree-clone
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` file:
   - Open `.env` in any text editor
   - Replace `your_supabase_project_url` with your Project URL
   - Replace `your_supabase_anon_key` with your anon key
   - Save the file

6. Start development server:
   ```bash
   npm run dev
   ```

7. Open browser to: http://localhost:3000/demo

## Step 3: Test It Out! (2 minutes)

### View Public Page
- Go to: http://localhost:3000/demo
- You should see the demo profile with some sample links! 🎉

### Access Admin Panel
- Go to: http://localhost:3000/demo/admin
- Password: `admin123`
- Click "Login"

### Make Some Changes
Try these:
1. Change the bio text → Save → Check public page (updates instantly!)
2. Change background color → Save → Watch it change in real-time!
3. Add a new section
4. Add a link to that section
5. Upload a profile image

## Step 4: Deploy to Internet (3 minutes)

### Push to GitHub
1. Create a new repository on GitHub.com
2. In your terminal:
   ```bash
   git init
   git add .
   git commit -m "My awesome link site"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Deploy to Vercel (FREE)
1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Click "Add New" → "Project"
4. Find your repository → Click "Import"
5. In Environment Variables section, click "Add":
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Project URL
   - Click "Add"
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your anon key
   - Click "Add"
6. Click "Deploy"
7. Wait 2-3 minutes... ☕
8. 🎉 Done! Your site is live!

### Get Your URL
- Vercel will show you a URL like: `your-project.vercel.app`
- Your public page: `your-project.vercel.app/demo`
- Your admin panel: `your-project.vercel.app/demo/admin`

## Step 5: Create Your Profile

### In Supabase SQL Editor
```sql
INSERT INTO profiles (username, admin_password, bio)
VALUES ('yourname', 'your-secure-password', 'Your bio here!');
```

Run this, then visit:
- Public: `your-project.vercel.app/yourname`
- Admin: `your-project.vercel.app/yourname/admin`

## Step 6: Add to Instagram Bio

In your Instagram bio, add:
```
🔗 your-project.vercel.app/yourname
```

## Creating Multiple Link Pages

### For Different People
Just add more profiles in Supabase:
```sql
INSERT INTO profiles (username, admin_password, bio)
VALUES ('friend1', 'password1', 'Friend bio');

INSERT INTO profiles (username, admin_password, bio)
VALUES ('friend2', 'password2', 'Another bio');
```

Now they can access:
- `your-project.vercel.app/friend1`
- `your-project.vercel.app/friend2`

### For Yourself on Different Sites
You can deploy the same code to multiple Vercel projects!
Just import the same GitHub repo multiple times.

## Troubleshooting

### "Profile not found"
- Make sure you created a profile in Supabase
- Check that the username in the URL matches the database
- Username is case-sensitive!

### "Invalid password" in admin
- Check the password in the database
- It's stored as plain text (see README for security improvements)

### Real-time updates not working
- Did you enable replication in Supabase?
- Check browser console for errors (F12 → Console tab)

### Images not uploading
- Is the `images` bucket public?
- Check Storage → images → Policies

### Deployment failed
- Did you add environment variables in Vercel?
- Check the build logs for specific errors

## Next Steps

### Security (IMPORTANT for production!)
The current setup stores passwords in plain text. For a production site:
1. Read the "Security Notes" section in README.md
2. Implement password hashing
3. Enable Row Level Security in Supabase
4. Add rate limiting

### Customization
- Change fonts in the component files
- Adjust colors and animations
- Add your own features!

### Custom Domain
1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel: Settings → Domains → Add
3. Follow the DNS setup instructions
4. Wait for verification (can take up to 48 hours)

## Need Help?

1. Check the full README.md for detailed docs
2. Review DEPLOYMENT.md for deployment options
3. Check browser console for errors (F12)
4. Review Supabase logs in the dashboard

## You're All Set! 🎉

Enjoy your new link sharing platform! Share it with friends, promote on social media, and customize it to your heart's content.

**Pro Tips:**
- Update your links regularly to keep followers engaged
- Use descriptive link titles
- Add custom icons to make links stand out
- Keep sections organized (Social, Work, Personal, etc.)
- Change colors seasonally for a fresh look

Happy linking! 🔗✨
