#!/bin/bash

# Quick setup script for Docker + Cloudflare Tunnel

set -e

echo "=== Docker + Cloudflare Tunnel Setup ==="
echo ""

# Get user's home directory
USER_HOME=$(eval echo ~$USER)
CLOUDFLARED_DIR="$USER_HOME/.cloudflared"
TUNNEL_ID="0a3a87bd-eea9-4613-a61b-8bdad26a4090"

# Create config directory
mkdir -p "$CLOUDFLARED_DIR"

# Get subdomain
echo "Enter your subdomain (e.g., api.yourdomain.com):"
read SUBDOMAIN

if [ -z "$SUBDOMAIN" ]; then
    echo "Error: Subdomain is required"
    exit 1
fi

# Create DNS route
echo ""
echo "Creating DNS route..."
cloudflared tunnel route dns ilia-beer-backend "$SUBDOMAIN"

# Create config file
echo ""
echo "Creating config file..."
cat > "$CLOUDFLARED_DIR/config.yml" << EOF
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $SUBDOMAIN
    service: http://backend:80
  - service: http_status:404
EOF

echo "Config file created at $CLOUDFLARED_DIR/config.yml"

# Update docker-compose.tunnel.yml with correct home path
echo ""
echo "Updating docker-compose.tunnel.yml with your home directory..."
sed -i "s|/home/ilia|$USER_HOME|g" docker-compose.tunnel.yml

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start everything:"
echo "  docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d"
echo ""
echo "Your backend will be available at: https://$SUBDOMAIN"
echo ""
echo "Check status:"
echo "  docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml ps"
echo "  docker logs ilia-beer-tunnel -f"

