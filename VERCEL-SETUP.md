# Vercel Deployment Setup

This guide will help you deploy the frontend to Vercel from the root directory.

## Prerequisites

1. A Vercel account (free tier works)
2. Your backend URL (from Cloudflare Tunnel or ngrok)

## Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect the configuration from `vercel.json`

## Step 2: Configure Build Settings

Vercel should automatically detect:
- **Root Directory**: `beerfront` (configured in `vercel.json`)
- **Framework Preset**: Next.js
- **Build Command**: `cd beerfront && npm install && npm run build`
- **Output Directory**: `beerfront/.next`

If it doesn't auto-detect, manually set:
- Root Directory: `beerfront`
- Framework: Next.js

## Step 3: Set Environment Variables

In your Vercel project settings, go to **Settings → Environment Variables** and add:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

Replace `your-backend-url.com` with:
- Your Cloudflare Tunnel URL (e.g., `https://api.yourdomain.com`)
- Or your ngrok URL (e.g., `https://abc123.ngrok-free.app`)

**Important**: 
- The `NEXT_PUBLIC_` prefix makes this variable available in the browser
- You'll need to redeploy after adding environment variables

## Step 4: Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies in `beerfront/`
   - Build your Next.js app
   - Deploy to a production URL

## Step 5: Verify Deployment

After deployment:
1. Visit your Vercel deployment URL
2. Check the browser console for any API errors
3. Test API connectivity:
   - Open browser DevTools → Network tab
   - Look for requests to `/api/videos`
   - They should go to your backend URL

## Troubleshooting

### Build Fails
- Check that `beerfront/package.json` exists
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### API Calls Fail
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check CORS settings on your backend (already configured)
- Make sure your backend tunnel is running

### Environment Variables Not Working
- Ensure variable name starts with `NEXT_PUBLIC_`
- Redeploy after adding/changing variables
- Check variable is set for "Production" environment

## Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL

## Continuous Deployment

Once connected:
- Every push to your main branch auto-deploys
- Pull requests get preview deployments
- You can configure branch-specific deployments in settings

## File Structure

```
ilia.beer/                    (Root - Git repo)
├── vercel.json              (Vercel config - points to beerfront)
├── beerfront/               (Next.js app)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
└── backend/                 (Not deployed to Vercel)
    └── ...
```

The `vercel.json` file tells Vercel to build from the `beerfront` directory even though the repo root is `ilia.beer`.

