#!/bin/bash
# ---------------------------------------------------------------
# Citely - First-Time Server Setup Script
# ---------------------------------------------------------------
# Usage: bash setup.sh
#
# This script sets up a fresh Ubuntu/Debian server to run the
# Citely Next.js application with PM2 and Nginx.
#
# What it does:
#   1. Updates system packages
#   2. Installs Node.js 20 via nvm
#   3. Installs PM2 globally
#   4. Installs Nginx
#   5. Clones the repository
#   6. Configures Nginx with SSL (Let's Encrypt)
#   7. Builds and starts the app
#   8. Sets PM2 to start on boot
#
# IMPORTANT: After running this script, you MUST:
#   - Copy your .env file to /var/www/citely/.env
#   - Set all required environment variables (database URL,
#     API keys, NextAuth secret, Stripe keys, etc.)
#   - Then run: cd /var/www/citely && bash deploy/deploy.sh
#
# Run this script as root or with sudo.
# ---------------------------------------------------------------

# Exit immediately if any command fails
set -e

# ----------------------------------------------------------
# Configuration - UPDATE THESE VALUES
# ----------------------------------------------------------
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"  # <-- Replace with your repo URL
APP_DIR="/var/www/citely"
DOMAIN="doodigital.co"
NODE_VERSION="20"

# ----------------------------------------------------------
# Helper functions
# ----------------------------------------------------------
log() {
    echo ""
    echo "============================================"
    echo "[setup] $1"
    echo "============================================"
}

error_exit() {
    echo "[setup] ERROR: $1" >&2
    exit 1
}

# ----------------------------------------------------------
# Check: must be run as root
# ----------------------------------------------------------
if [ "$EUID" -ne 0 ]; then
    error_exit "Please run this script as root (sudo bash setup.sh)"
fi

# ----------------------------------------------------------
# Step 1: Update system packages
# ----------------------------------------------------------
log "Updating system packages..."
apt-get update -y
apt-get upgrade -y

# ----------------------------------------------------------
# Step 2: Install essential build tools
# ----------------------------------------------------------
log "Installing build essentials and git..."
apt-get install -y curl git build-essential

# ----------------------------------------------------------
# Step 3: Install Node.js 20 via nvm
# ----------------------------------------------------------
log "Installing nvm and Node.js ${NODE_VERSION}..."

# Install nvm for the current user
export NVM_DIR="/root/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi

# Load nvm into current shell
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"
nvm alias default "$NODE_VERSION"

# Verify installation
node --version || error_exit "Node.js installation failed"
npm --version || error_exit "npm installation failed"

# ----------------------------------------------------------
# Step 4: Install PM2 globally
# ----------------------------------------------------------
log "Installing PM2..."
npm install -g pm2

# ----------------------------------------------------------
# Step 5: Install Nginx
# ----------------------------------------------------------
log "Installing Nginx..."
apt-get install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

# ----------------------------------------------------------
# Step 6: Create app directory and clone repository
# ----------------------------------------------------------
log "Setting up application directory..."

# Create the directory if it does not exist
mkdir -p "$APP_DIR"

# Clone the repository
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository already cloned. Pulling latest..."
    cd "$APP_DIR"
    git pull origin main
else
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# ----------------------------------------------------------
# Step 7: Configure Nginx
# ----------------------------------------------------------
log "Configuring Nginx..."

# Copy the Nginx config
cp "$APP_DIR/deploy/nginx.conf" "/etc/nginx/sites-available/$DOMAIN"

# Create symlink to enable the site
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

# Remove default Nginx site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t || error_exit "Nginx configuration test failed"

# Reload Nginx
systemctl reload nginx

# ----------------------------------------------------------
# Step 8: Set up SSL with Let's Encrypt (certbot)
# ----------------------------------------------------------
log "Setting up SSL with Let's Encrypt..."

# Install certbot and the Nginx plugin
apt-get install -y certbot python3-certbot-nginx

# Create the certbot webroot directory
mkdir -p /var/www/certbot

# Obtain SSL certificate
# Note: This requires DNS to already be pointing to this server
echo ""
echo "  Attempting to obtain SSL certificate..."
echo "  Make sure DNS for $DOMAIN and www.$DOMAIN points to this server."
echo ""

certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" || {
    echo ""
    echo "  WARNING: Certbot failed. This is expected if DNS is not yet configured."
    echo "  After DNS is set up, run manually:"
    echo "    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo ""
}

# ----------------------------------------------------------
# Step 9: Install dependencies and build
# ----------------------------------------------------------
log "Installing dependencies and building..."

cd "$APP_DIR"

# Install all dependencies (including dev for build)
npm ci

# Generate Prisma client
npx prisma generate

# Build the Next.js application
npm run build || {
    echo ""
    echo "  WARNING: Build failed. This is expected if .env is not configured yet."
    echo "  Set your environment variables in $APP_DIR/.env and run:"
    echo "    cd $APP_DIR && npm run build"
    echo ""
}

# ----------------------------------------------------------
# Step 10: Start the app with PM2
# ----------------------------------------------------------
log "Starting application with PM2..."

cd "$APP_DIR"
pm2 start ecosystem.config.js || {
    echo ""
    echo "  WARNING: PM2 start failed. Build the app first, then run:"
    echo "    cd $APP_DIR && pm2 start ecosystem.config.js"
    echo ""
}

# ----------------------------------------------------------
# Step 11: Set PM2 to start on boot
# ----------------------------------------------------------
log "Configuring PM2 startup on boot..."

pm2 save
pm2 startup systemd -u root --hp /root

# ----------------------------------------------------------
# Setup complete
# ----------------------------------------------------------
log "Server setup complete!"

echo ""
echo "---------------------------------------------------------------"
echo "  NEXT STEPS - IMPORTANT"
echo "---------------------------------------------------------------"
echo ""
echo "  1. Create your environment file:"
echo "     nano $APP_DIR/.env"
echo ""
echo "  2. Add all required environment variables:"
echo "     - DATABASE_URL (LibSQL/Turso connection string)"
echo "     - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "     - NEXTAUTH_URL (https://$DOMAIN)"
echo "     - ANTHROPIC_API_KEY"
echo "     - OPENAI_API_KEY"
echo "     - STRIPE_SECRET_KEY"
echo "     - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "     - STRIPE_WEBHOOK_SECRET"
echo ""
echo "  3. Rebuild and restart:"
echo "     cd $APP_DIR && bash deploy/deploy.sh"
echo ""
echo "  4. If SSL failed, configure DNS and run:"
echo "     sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "  5. Verify everything is running:"
echo "     pm2 status"
echo "     curl -I https://$DOMAIN"
echo ""
echo "---------------------------------------------------------------"
