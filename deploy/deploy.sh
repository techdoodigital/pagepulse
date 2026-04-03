#!/bin/bash
# ---------------------------------------------------------------
# Citely - Deployment Script
# ---------------------------------------------------------------
# Usage: bash deploy/deploy.sh
#
# This script pulls the latest code, installs dependencies,
# generates Prisma client, builds the app, and restarts PM2.
#
# Prerequisites:
#   - The app is already set up (see setup.sh for first-time setup)
#   - PM2 is running with the "citely" process
#   - Environment variables are configured in .env
#
# Run from the project root directory (/var/www/citely)
# ---------------------------------------------------------------

# Exit immediately if any command fails
set -e

# ----------------------------------------------------------
# Configuration
# ----------------------------------------------------------
APP_DIR="/var/www/citely"
APP_NAME="citely"

# ----------------------------------------------------------
# Helper functions
# ----------------------------------------------------------
log() {
    echo "[deploy] $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

error_exit() {
    echo "[deploy] ERROR: $1" >&2
    exit 1
}

# ----------------------------------------------------------
# Pre-flight checks
# ----------------------------------------------------------
log "Starting deployment..."

# Make sure we are in the correct directory
cd "$APP_DIR" || error_exit "Could not change to $APP_DIR"

# Check that PM2 is available
command -v pm2 >/dev/null 2>&1 || error_exit "PM2 is not installed. Run setup.sh first."

# Check that node is available
command -v node >/dev/null 2>&1 || error_exit "Node.js is not installed."

# ----------------------------------------------------------
# Step 1: Pull latest code from git
# ----------------------------------------------------------
log "Pulling latest code from git..."
git pull origin main || error_exit "Git pull failed"

# ----------------------------------------------------------
# Step 2: Install production dependencies
# ----------------------------------------------------------
log "Installing dependencies..."
npm ci --production || error_exit "npm ci failed"

# ----------------------------------------------------------
# Step 3: Generate Prisma client
# ----------------------------------------------------------
log "Generating Prisma client..."
npx prisma generate || error_exit "Prisma generate failed"

# ----------------------------------------------------------
# Step 4: Build the application
# ----------------------------------------------------------
log "Building the application..."
npm run build || error_exit "Build failed"

# ----------------------------------------------------------
# Step 5: Restart PM2 process (graceful reload)
# ----------------------------------------------------------
log "Restarting PM2 process..."
pm2 reload "$APP_NAME" || error_exit "PM2 reload failed"

# ----------------------------------------------------------
# Done
# ----------------------------------------------------------
log "Deployment completed successfully!"
pm2 status "$APP_NAME"
