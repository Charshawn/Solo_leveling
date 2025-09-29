# Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Next.js app

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `app` (since the Next.js app is in the `app` folder)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)

4. **Deploy**: Click "Deploy" and wait for the build to complete

## Alternative: Manual Deploy

If you prefer to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the app directory
cd app

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: solo-leveling-mvp
# - Directory: ./
# - Override settings? N
```

## Troubleshooting

### If you get dependency errors:
The `.npmrc` file with `legacy-peer-deps=true` should resolve most dependency conflicts.

### If you get build errors:
- Check that the root directory is set to `app` in Vercel settings
- Ensure all dependencies are properly installed
- Check the build logs in Vercel dashboard

## Environment Variables

No environment variables are required for this app as it uses localStorage for data persistence.

## Post-Deployment

After successful deployment:
1. Your app will be available at `https://your-project-name.vercel.app`
2. The app works offline and stores data locally
3. Users can install it as a PWA on mobile devices
