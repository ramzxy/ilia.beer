#!/bin/bash

# Quick fix script for tunnel command

echo "Checking config file..."
if [ ! -f ~/.cloudflared/config.yml ]; then
    echo "ERROR: Config file not found at ~/.cloudflared/config.yml"
    echo "Please create it first (see DOCKER-TUNNEL-SETUP.md)"
    exit 1
fi

echo "Config file found!"
echo ""
echo "Restarting tunnel container..."

# Stop and remove the tunnel container
docker stop ilia-beer-tunnel 2>/dev/null
docker rm ilia-beer-tunnel 2>/dev/null

# Restart with updated config
cd ~/ilia.beer/backend
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d cloudflared

echo ""
echo "Checking tunnel logs..."
sleep 2
docker logs ilia-beer-tunnel --tail 20

