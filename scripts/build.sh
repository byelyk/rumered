#!/bin/bash

# Build script for Netlify deployment
set -e

echo "🔧 Starting build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema (safer than migrate deploy for existing databases)
echo "🗄️ Syncing database schema..."
npx prisma db push --accept-data-loss

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
