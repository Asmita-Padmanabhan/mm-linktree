# Quick Deployment Guide

## Step-by-Step Deployment to Vercel

### 1. Prepare Your Code
```bash
# Make sure all files are committed
git init
git add .
git commit -m "Initial commit"
```

### 2. Push to GitHub
```bash
# Create a new repository on GitHub
# Then push your code
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` = `your_url`
   - Add `VITE_SUPABASE_ANON_KEY` = `your_key`
7. Click "Deploy"

Your site will be live in ~2 minutes! 🎉

## For Instagram Bio

Once deployed, your URL will be something like:
`your-project.vercel.app/yourusername`

Add to Instagram bio:
```
🔗 your-project.vercel.app/yourusername
```

## Custom Domain (Optional)

In Vercel:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions
4. Wait for verification

Then use:
```
🔗 yourdomain.com/yourusername
```

## Multiple Websites

### Same Deployment, Different Users
- Deploy ONCE
- Each person gets: `yoursite.com/their-username`
- Add their profile to Supabase
- They access via their unique URL

### Separate Deployments
If you want completely separate websites:
1. Deploy the code again to a new Vercel project
2. Use the SAME Supabase database
3. Each deployment can serve a different primary user
4. Change the default route in `App.jsx`:
   ```jsx
   <Route path="/" element={<Navigate to="/specificuser" replace />} />
   ```

This way:
- `site1.vercel.app` → redirects to `/user1`
- `site2.vercel.app` → redirects to `/user2`
- Both use the same database!

## Cost Breakdown

**FREE Tier Includes:**
- Vercel: Unlimited hobby deployments
- Supabase: 500MB database, 1GB storage, 2GB bandwidth
- Custom domain: You only pay for domain registration ($10-15/year)

**If you need more:**
- Supabase Pro: $25/month (8GB database, 100GB storage)
- Vercel Pro: $20/month (more bandwidth, better analytics)

For most personal link pages, FREE tier is more than enough! 🚀
