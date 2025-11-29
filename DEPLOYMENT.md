# M Timepiece - Deployment Guide

This guide covers deploying the M Timepiece e-commerce application with separate frontend and backend deployments.

## 📁 Project Structure

```
Watch-Junction/
├── frontend/          # React + Vite application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── backend/           # Express API server
│   ├── routes/
│   ├── database.sqlite
│   ├── package.json
│   └── .env.example
└── package.json       # Root workspace scripts
```

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies

```bash
# Install all dependencies (root, frontend, and backend)
npm run install:all
```

### 2. Configure Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
```

**Backend** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
FRONTEND_URL=http://localhost:5173
DB_PATH=./database.sqlite
```

### 3. Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/login

---

## 🌐 Production Deployment

### Frontend Deployment (Vercel)

#### Step 1: Prepare Frontend
1. Navigate to the frontend directory
2. Ensure `frontend/vercel.json` exists (already created)

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL with `/api` suffix (e.g., `https://your-backend.railway.app/api`)
6. Click **"Deploy"**

#### Step 3: Get Frontend URL
After deployment, copy your Vercel URL (e.g., `https://watch-junction.vercel.app`)

---

### Backend Deployment (Railway)

#### Step 1: Prepare Backend
1. Ensure `backend/railway.json` exists (already created)
2. Ensure database file exists in `backend/database.sqlite`

#### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure project:
   - **Root Directory**: `backend`
   - **Start Command**: `node index.js` (auto-detected from railway.json)

#### Step 3: Configure Environment Variables
Add these environment variables in Railway dashboard:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=<generate-a-secure-random-string>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-secure-password>
FRONTEND_URL=https://watch-junction.vercel.app
DB_PATH=./database.sqlite
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

> [!IMPORTANT]
> **Generate a secure JWT_SECRET**: Use a random string generator or run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

#### Step 4: Get Backend URL
After deployment, copy your Railway URL (e.g., `https://your-backend.railway.app`)

#### Step 5: Update Frontend Environment Variable
Go back to Vercel dashboard and update `VITE_API_URL` with your Railway backend URL.

---

## ✅ Verification

### Test Frontend
1. Visit your Vercel URL
2. Browse products
3. Add items to cart
4. Test checkout flow

### Test Backend API
```bash
# Health check
curl https://your-backend.railway.app/health

# Get products
curl https://your-backend.railway.app/api/products
```

### Test Admin Panel
1. Go to `https://your-vercel-url.vercel.app/login`
2. Login with your admin credentials
3. Verify dashboard loads
4. Test adding/editing products

---

## 🔧 Alternative Deployment Options

### Backend Alternatives
- **Render**: Similar to Railway, supports Node.js
- **Heroku**: Classic PaaS platform
- **DigitalOcean App Platform**: Simple deployment

### Frontend Alternatives
- **Netlify**: Similar to Vercel
- **Cloudflare Pages**: Fast CDN-based hosting
- **GitHub Pages**: Free static hosting (requires hash routing)

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables configured correctly
- [ ] CORS configured (backend allows frontend URL)
- [ ] Admin login works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] API calls from frontend to backend work
- [ ] Changed default admin password
- [ ] Database has products seeded

---

## 🐛 Troubleshooting

### CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly

### 404 on Frontend Routes
**Problem**: Refreshing page shows 404
**Solution**: Ensure `vercel.json` exists in frontend directory with SPA rewrites

### Database Not Found
**Problem**: Backend can't find database
**Solution**: Ensure `database.sqlite` is in backend directory and `DB_PATH` is set correctly

### API Calls Fail
**Problem**: Frontend API calls return errors
**Solution**: Check `VITE_API_URL` in Vercel environment variables points to correct backend URL and ends with `/api`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express CORS Configuration](https://expressjs.com/en/resources/middleware/cors.html)

---

## 🔐 Security Notes

> [!CAUTION]
> **Before going live:**
> 1. Change default admin password
> 2. Use strong JWT_SECRET (minimum 32 characters)
> 3. Enable HTTPS only (both platforms do this by default)
> 4. Review and restrict CORS origins
> 5. Set up database backups
> 6. Monitor error logs regularly
