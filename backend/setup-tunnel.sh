#!/bin/bash

# Cloudflare Tunnel Quick Setup Script for Raspberry Pi
# This script helps you set up Cloudflare Tunnel quickly

set -e

echo "=== Cloudflare Tunnel Setup for ilia.beer Backend ==="
echo ""

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "Installing cloudflared..."
    
    ARCH=$(uname -m)
    if [ "$ARCH" = "aarch64" ]; then
        echo "Detected ARM64 architecture"
        wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
        sudo dpkg -i cloudflared-linux-arm64.deb
        rm cloudflared-linux-arm64.deb
    elif [ "$ARCH" = "armv7l" ]; then
        echo "Detected ARM32 architecture"
        wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm
        sudo mv cloudflared-linux-arm /usr/local/bin/cloudflared
        sudo chmod +x /usr/local/bin/cloudflared
    else
        echo "Unsupported architecture: $ARCH"
        exit 1
    fi
else
    echo "cloudflared is already installed"
fi

# Login
echo ""
echo "Please login to Cloudflare..."
cloudflared tunnel login

# Create tunnel
echo ""
read -p "Enter a name for your tunnel (default: ilia-beer-backend): " TUNNEL_NAME
TUNNEL_NAME=${TUNNEL_NAME:-ilia-beer-backend}

echo "Creating tunnel: $TUNNEL_NAME"
TUNNEL_OUTPUT=$(cloudflared tunnel create "$TUNNEL_NAME")
TUNNEL_ID=$(echo "$TUNNEL_OUTPUT" | grep -oP '(?<=Created tunnel )[a-f0-9-]+' || echo "")

if [ -z "$TUNNEL_ID" ]; then
    echo "Failed to create tunnel. Please check the output above."
    exit 1
fi

echo "Tunnel created with ID: $TUNNEL_ID"

# Create DNS record
echo ""
read -p "Enter your subdomain (e.g., api.yourdomain.com): " SUBDOMAIN

if [ -n "$SUBDOMAIN" ]; then
    echo "Creating DNS record..."
    cloudflared tunnel route dns "$TUNNEL_NAME" "$SUBDOMAIN"
fi

# Create config directory
mkdir -p ~/.cloudflared

# Create config file
echo ""
read -p "Enter backend port (default: 8080): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-8080}

CONFIG_FILE="$HOME/.cloudflared/config.yml"
cat > "$CONFIG_FILE" << EOF
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $SUBDOMAIN
    service: http://localhost:$BACKEND_PORT
  - service: http_status:404
EOF

echo "Config file created at $CONFIG_FILE"

# Create systemd service
echo ""
read -p "Create systemd service? (y/n): " CREATE_SERVICE
if [ "$CREATE_SERVICE" = "y" ]; then
    sudo tee /etc/systemd/system/cloudflared.service > /dev/null << EOF
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/cloudflared tunnel --config $CONFIG_FILE run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable cloudflared
    sudo systemctl start cloudflared
    
    echo "Service created and started!"
    echo "Check status with: sudo systemctl status cloudflared"
fi

echo ""
echo "=== Setup Complete ==="
echo "Your backend should be accessible at: https://$SUBDOMAIN"
echo ""
echo "Update your frontend .env with:"
echo "NEXT_PUBLIC_BACKEND_URL=https://$SUBDOMAIN"

