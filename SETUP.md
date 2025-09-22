# 🚀 Rumered Setup Guide

Complete step-by-step guide to set up and run the Rumered web application.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A code editor (VS Code recommended)
- A GitHub account
- A Neon PostgreSQL database account (free tier available)
- A StackAuth account (free tier available)

## 🛠️ Step 1: Initial Setup

### 1.1 Clone and Install Dependencies

```bash
cd /Users/kyleokoth/Downloads/rumered
npm install
```

### 1.2 Verify Installation

```bash
npm run dev
```

The app should start at http://localhost:3000 (you'll see the landing page but with empty content).

## 🗄️ Step 2: Database Setup

### 2.1 Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/login with GitHub
3. Click "Create Project"
4. Choose a name: `rumered`
5. Select a region close to you
6. Click "Create Project"
7. Copy the connection string (it looks like: `postgresql://username:password@hostname/database`)

### 2.2 Configure Environment Variables

```bash
# Create .env.local file
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database
DATABASE_URL="your_neon_connection_string_here"

# StackAuth (we'll set this up later)
STACKAUTH_API_KEY=""
STACKAUTH_ISSUER=""

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2.3 Set Up Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 2.4 Verify Database

```bash
# Open Prisma Studio to see your data
npm run db:studio
```

## 🔐 Step 3: Authentication Setup (StackAuth)

### 3.1 Create StackAuth Account

1. Go to [StackAuth](https://stackauth.com/)
2. Sign up with GitHub
3. Create a new project: "Rumered"
4. Note down your API Key and Issuer

### 3.2 Configure StackAuth

Update your `.env.local`:

```env
# StackAuth
STACKAUTH_API_KEY="your_stackauth_api_key"
STACKAUTH_ISSUER="your_stackauth_issuer"
```

### 3.3 Update Admin User

After setting up StackAuth, you'll need to:

1. Create an admin user in StackAuth
2. Update the seed script with the real StackAuth user ID
3. Re-run the seed script

## 🚀 Step 4: Test the Application

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test All Features

1. **Landing Page**: http://localhost:3000
2. **Fit Check**: http://localhost:3000/fit-check
3. **Dorm Rooms**: http://localhost:3000/rooms
4. **Login**: http://localhost:3000/login
5. **Register**: http://localhost:3000/register
6. **Account**: http://localhost:3000/account (after login)
7. **Admin**: http://localhost:3000/admin (admin only)

### 4.3 Test Voting System

1. Go to Fit Check or Dorm Rooms
2. Click "Vote" on any item
3. Use the sliders to rate (1-10)
4. Submit your vote
5. See updated scores

### 4.4 Test Room Applications

1. Login to your account
2. Go to Dorm Rooms
3. Click "Apply to Feature Your Room"
4. Fill out the application form
5. Submit and check your account page

## 🌐 Step 5: Deploy to Netlify

### 5.1 Push to GitHub

```bash
# Add your GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/rumered.git
git branch -M main
git push -u origin main
```

### 5.2 Deploy to Netlify

1. Go to [Netlify](https://netlify.com/)
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Choose your rumered repository
5. Build settings:
   - Build command: `prisma generate && prisma migrate deploy && next build`
   - Publish directory: `.next`
6. Add environment variables in Netlify dashboard:
   - `DATABASE_URL`
   - `STACKAUTH_API_KEY`
   - `STACKAUTH_ISSUER`
   - `NEXT_PUBLIC_SITE_URL` (your Netlify URL)
7. Deploy!

## 🎯 Step 6: Production Setup

### 6.1 Update Admin User

1. Create admin user in StackAuth
2. Update the database with the real admin user ID:

```sql
UPDATE "User" SET id = 'real_stackauth_user_id' WHERE email = 'admin@rumered.app';
```

### 6.2 Configure Domain

1. In Netlify, go to Domain settings
2. Add your custom domain
3. Update `NEXT_PUBLIC_SITE_URL` in environment variables

## 🔧 Troubleshooting

### Common Issues:

1. **StackAuth Errors**: Make sure environment variables are set correctly
2. **Database Connection**: Verify your DATABASE_URL is correct
3. **Build Errors**: Check that all dependencies are installed
4. **Voting Not Working**: Ensure you're logged in and database is connected

### Useful Commands:

```bash
# Reset database
npm run db:push --force-reset
npm run db:seed

# Check database connection
npm run db:studio

# View logs
npm run dev

# Build for production
npm run build
```

## 📱 Features to Test

### User Features:

- [ ] Browse outfits and rooms
- [ ] Vote on content (requires login)
- [ ] Submit room application
- [ ] View account and voting history

### Admin Features:

- [ ] Access admin dashboard
- [ ] Manage rooms (CRUD)
- [ ] Manage outfits (CRUD)
- [ ] Review applications
- [ ] Create rooms from applications

## 🎉 You're Done!

Your Rumered application should now be fully functional with:

- ✅ Database with sample data
- ✅ Authentication system
- ✅ Voting functionality
- ✅ Admin management
- ✅ Room applications
- ✅ Responsive design
- ✅ Production deployment

Visit your deployed site and start showcasing college style and dorm rooms!
