# Digital Ocean App Platform Deployment Script
# Run this script to deploy immediately

Write-Host "🚀 Deploying to Digital Ocean App Platform..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if remote exists
$remoteExists = git remote | Select-String -Pattern "origin"
if ($remoteExists) {
    Write-Host "Updating git remote..." -ForegroundColor Yellow
    git remote set-url origin https://github.com/bbarnes4318/hopper.git
} else {
    Write-Host "Adding git remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/bbarnes4318/hopper.git
}

# Stage all files
Write-Host "Staging files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
$commitMessage = "Deploy to Digital Ocean App Platform - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

# Push to main
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main --force

Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://cloud.digitalocean.com/apps" -ForegroundColor White
Write-Host "2. Click 'Create App' → Select GitHub → Choose 'bbarnes4318/hopper'" -ForegroundColor White
Write-Host "3. DigitalOcean will auto-detect .do/app.yaml" -ForegroundColor White
Write-Host "4. Create/Link database and set environment variables" -ForegroundColor White
Write-Host "5. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "OR use doctl CLI:" -ForegroundColor Cyan
Write-Host "  doctl apps create --spec .do/app.yaml" -ForegroundColor White

