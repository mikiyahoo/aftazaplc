#!/bin/bash

# Admin Panel Deployment Script for cPanel
# This script sets up admin.aftaza.com as a separate Node.js application
# Run this via SSH on your cPanel server

set -e  # Exit on error

echo "=========================================="
echo "Admin Panel Deployment Script"
echo "=========================================="

# Configuration
ADMIN_DIR="/home/aftazaco/admin"
MAIN_DIR="/home/aftazaco/public_html/aftaza"
NODE_VERSION="20.20.0"

# Step 1: Create admin directory
echo ""
echo "Step 1: Creating admin directory..."
mkdir -p "$ADMIN_DIR"
echo "✓ Directory created: $ADMIN_DIR"

# Step 2: Copy built application files
echo ""
echo "Step 2: Copying built application..."
cp -r "$MAIN_DIR/.next" "$ADMIN_DIR/"
cp "$MAIN_DIR/package.json" "$ADMIN_DIR/"
cp "$MAIN_DIR/package-lock.json" "$ADMIN_DIR/" 2>/dev/null || echo "  (no package-lock.json found)"
cp -r "$MAIN_DIR/node_modules" "$ADMIN_DIR/" 2>/dev/null || echo "  (node_modules will be installed)"
cp -r "$MAIN_DIR/public" "$ADMIN_DIR/"
cp "$MAIN_DIR/next.config.js" "$ADMIN_DIR/"
cp "$MAIN_DIR/next-env.d.ts" "$ADMIN_DIR/" 2>/dev/null || true
cp "$MAIN_DIR/server.js" "$ADMIN_DIR/" 2>/dev/null || echo "  (server.js not found - ensure it exists)"
echo "✓ Files copied"

# Step 3: Install dependencies (includes postinstall prisma generate)
echo ""
echo "Step 3: Installing dependencies and generating Prisma client..."
cd "$ADMIN_DIR"
npm install
echo "✓ Dependencies installed"

# Step 4: Build the application (if needed)
echo ""
echo "Step 4: Building application..."
npm run build
echo "✓ Build complete"

# Step 5: Set permissions (if needed)
echo ""
echo "Step 5: Setting permissions..."
chmod -R 755 "$ADMIN_DIR"
echo "✓ Permissions set"

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. In cPanel → Setup Node.js App, create app with:"
echo "   - Application root: admin"
echo "   - Application URL: admin.aftaza.com"
echo "   - Startup file: server.js"
echo "   - Node version: $NODE_VERSION"
echo ""
echo "2. Set environment variables:"
echo "   NEXTAUTH_URL=https://admin.aftaza.com"
echo "   (plus all other required env vars from main app)"
echo ""
echo "3. Restart the Node.js application"
echo ""
echo "Test: https://admin.aftaza.com/api/admin/login"
echo ""
