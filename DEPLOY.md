# 🚀 Deploy Instructions for PandaKey Games

## 📋 Pre-Deploy Checklist

✅ Repository: https://github.com/OskarFate/pandakey
✅ Next.js 14.2.4 configured for production
✅ All API endpoints implemented
✅ MongoDB Atlas connection ready
✅ MercadoLibre OAuth configured
✅ KeyBin API integration ready

## 🌐 DigitalOcean App Platform Deploy

### Method 1: Using DigitalOcean Dashboard

1. **Go to DigitalOcean App Platform**
   - Login to: https://cloud.digitalocean.com/apps
   - Click "Create App"

2. **Connect GitHub Repository**
   - Select GitHub as source
   - Choose repository: `OskarFate/pandakey`
   - Select branch: `main`
   - Auto-deploy: ✅ Enabled

3. **Configure Build Settings**
   - Build Command: `npm ci && npm run build`
   - Run Command: `npm start`
   - Environment: Node.js
   - HTTP Port: 3000 (automatic)

4. **Set Environment Variables (SECRETS)**
   ```bash
   MONGODB_URI=mongodb+srv://oskarfate_db_user:3JpaOiHFWiMLuJIp@cluster0.npxl5n3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   NEXTAUTH_SECRET=tu-nextauth-secret-super-seguro-cambiar-en-produccion
   JWT_SECRET=tu-jwt-secret-super-seguro-cambiar-en-produccion
   KEYBIN_API_KEY=_VOnjV_s5uh(p4EEAi#n
   MLC_CLIENT_SECRET=vpbfBMsz1uMJ0ptKJj5KhKEQrVgfacuX
   ```

5. **Review & Deploy**
   - App Name: `pandakey-games`
   - Region: Choose closest to your users
   - Plan: Basic ($5/month recommended)

### Method 2: Using doctl CLI

```bash
# Install doctl (if not installed)
snap install doctl

# Authenticate
doctl auth init

# Deploy using app spec
doctl apps create --spec .do/app.yaml
```

## 🔧 Post-Deploy Configuration

### 1. Update MercadoLibre OAuth Redirect URI
Once deployed, update your MercadoLibre app settings:
- **New Redirect URI**: `https://your-app-url.ondigitalocean.app/api/ml-auth`
- Or use custom domain: `https://pandakey.games/api/ml-auth`

### 2. Test Endpoints
```bash
# Health check
curl https://your-app-url.ondigitalocean.app/api/health

# KeyBin products
curl https://your-app-url.ondigitalocean.app/api/keybin/products

# Games list
curl https://your-app-url.ondigitalocean.app/api/games
```

### 3. Test MercadoLibre OAuth Flow
1. Go to: `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=296927981421309&redirect_uri=https://your-app-url.ondigitalocean.app/api/ml-auth`
2. Authorize the app
3. Check that tokens are saved to MongoDB

## 🌍 Custom Domain (Optional)

1. **Add Domain in DigitalOcean**
   - Go to App Settings → Domains
   - Add: `pandakey.games`
   - Add: `www.pandakey.games`

2. **Update DNS Records**
   ```
   CNAME www your-app-url.ondigitalocean.app
   ALIAS @ your-app-url.ondigitalocean.app
   ```

## 📊 Monitoring

- **App Dashboard**: Check build logs and runtime logs
- **MongoDB Atlas**: Monitor database connections
- **Uptime**: Set up monitoring for `https://your-app.com/api/health`

## 🔄 Auto-Deploy

The app will automatically redeploy when you push to the `main` branch on GitHub.

## 🆘 Troubleshooting

### Build Fails
- Check build logs in DigitalOcean dashboard
- Verify package.json and dependencies
- Ensure Next.js config is correct

### Runtime Errors
- Check environment variables are set
- Verify MongoDB connection string
- Check API logs for detailed errors

### OAuth Issues
- Verify MercadoLibre redirect URI matches exactly
- Check client ID and secret are correct
- Ensure MongoDB is accessible

---

## 🎯 Expected Result

After successful deploy:
- ✅ App running on DigitalOcean
- ✅ All API endpoints accessible
- ✅ MongoDB connection working
- ✅ MercadoLibre OAuth flow functional
- ✅ KeyBin product sync operational