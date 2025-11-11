# 🚀 IMMEDIATE DEPLOYMENT GUIDE - Digital Ocean App Platform

## Quick Deploy Steps

### 1. Push Code to GitHub

```powershell
# Make sure you're in the project root
cd C:\Users\jimbo\Downloads\hoppy

# Initialize git if needed
git init

# Add all files (except those in .gitignore)
git add .

# Commit
git commit -m "Deploy to Digital Ocean App Platform"

# Add remote (if not already added)
git remote remove origin 2>$null
git remote add origin https://github.com/bbarnes4318/hopper.git

# Push to main branch
git branch -M main
git push -u origin main --force
```

### 2. Deploy via Digital Ocean CLI (FASTEST METHOD)

```powershell
# Make sure doctl is authenticated
doctl auth init

# Deploy the app
doctl apps create --spec .do/app.yaml
```

**OR** Deploy via Web UI:

1. Go to: https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Select **"GitHub"** → Authorize → Select `bbarnes4318/hopper`
4. Select branch: `main`
5. DigitalOcean should auto-detect `.do/app.yaml`
6. Click **"Next"** → **"Create Resources"**

### 3. Set Environment Variables

After deployment, you'll need to set these secrets in Digital Ocean dashboard:

**For API Service:**
- `DATABASE_URL` - Will be auto-set when you link the database
- `JWT_SECRET` - Generate with: `openssl rand -hex 32` (or use PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`)

**For Web Service:**
- `NEXT_PUBLIC_API_URL` - Set after deployment (will be like `https://hopwhistle-api-xxxxx.ondigitalocean.app`)
- `NEXT_PUBLIC_WS_URL` - Set after deployment (will be like `wss://hopwhistle-api-xxxxx.ondigitalocean.app`)

### 4. Create/Link Database

1. In App Platform → **Resources** → **Add Resource** → **Database**
2. Create new PostgreSQL 18 database OR link existing
3. This auto-sets `DATABASE_URL` for your API service

### 5. Update CORS After Deployment

After deployment, update `CORS_ORIGINS` in API service:
- Go to API service → Settings → Environment Variables
- Update `CORS_ORIGINS` with your actual web app URL:
  ```
  ["https://hopwhistle-web-xxxxx.ondigitalocean.app"]
  ```

### 6. Verify Deployment

- API Health: `https://your-api-url.ondigitalocean.app/healthz`
- API Docs: `https://your-api-url.ondigitalocean.app/docs`
- Web App: `https://your-web-url.ondigitalocean.app`

## Troubleshooting

### If deployment fails:
1. Check build logs in Digital Ocean dashboard
2. Verify Dockerfiles exist: `api/Dockerfile` and `web/Dockerfile`
3. Ensure all dependencies are in `requirements.txt` and `package.json`

### If database connection fails:
1. Verify database is linked in App Platform
2. Check `DATABASE_URL` is set correctly
3. Ensure database firewall allows App Platform IPs

### If CORS errors:
1. Update `CORS_ORIGINS` with exact web app URL
2. Use HTTPS URLs (not HTTP)
3. Redeploy API service after updating CORS

## What Was Fixed

✅ Updated `.do/app.yaml` with correct repo: `bbarnes4318/hopper`
✅ Fixed web Dockerfile to handle PORT environment variable
✅ Enhanced CORS_ORIGINS parsing to handle JSON strings
✅ Verified API Dockerfile and run commands

## Next Steps After Deployment

1. Seed database (optional): Run `python scripts/seed.py` via one-off task
2. Create admin user via API or database
3. Test login and functionality
4. Monitor logs for any issues

