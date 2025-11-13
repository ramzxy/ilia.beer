# Quick Start: Deploy to Vercel

## One-Time Setup

1. **Push your code to GitHub/GitLab/Bitbucket** (if not already)

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your repository** (`ilia.beer`)

5. **Configure Root Directory** (IMPORTANT):
   - After importing, go to **Settings → General**
   - Under "Root Directory", click "Edit"
   - Select `beerfront` from the dropdown
   - Click "Save"
   
6. **Vercel will auto-detect**:
   - ✅ Framework: Next.js
   - ✅ Build settings (from `vercel.json`)

6. **Add Environment Variable**:
   - Go to **Settings → Environment Variables**
   - Add: `NEXT_PUBLIC_BACKEND_URL`
   - Value: Your backend URL (e.g., `https://api.yourdomain.com`)
   - Environment: Production, Preview, Development (select all)

7. **Click "Deploy"**

That's it! Your site will be live at `your-project.vercel.app`

## After Deployment

- Every push to main branch = automatic deployment
- Pull requests = preview deployments
- Environment variables are already configured

## Update Backend URL

If you change your backend URL:
1. Go to **Settings → Environment Variables**
2. Update `NEXT_PUBLIC_BACKEND_URL`
3. Click **Redeploy** (or push a new commit)

## Custom Domain

1. **Settings → Domains**
2. Add your domain
3. Follow DNS instructions
4. SSL is automatic

## Troubleshooting

**Build fails?**
- Check Vercel build logs
- Ensure `beerfront/package.json` exists
- Verify Node.js version (Vercel uses 18+)

**API not working?**
- Check `NEXT_PUBLIC_BACKEND_URL` is set
- Verify backend tunnel is running
- Check browser console for errors

