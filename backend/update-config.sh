#!/bin/bash

# Update cloudflared config for Docker

CONFIG_FILE="$HOME/.cloudflared/config.yml"

echo "Updating config file: $CONFIG_FILE"
echo ""

cat > "$CONFIG_FILE" << 'EOF'
tunnel: 0a3a87bd-eea9-4613-a61b-8bdad26a4090
credentials-file: /etc/cloudflared/0a3a87bd-eea9-4613-a61b-8bdad26a4090.json

ingress:
  - hostname: api.ilia.beer
    service: http://backend:80
  - service: http_status:404
EOF

echo "Config file updated!"
echo ""
echo "New config:"
cat "$CONFIG_FILE"
echo ""
echo "Now restart the tunnel container:"
echo "  docker stop ilia-beer-tunnel"
echo "  docker rm ilia-beer-tunnel"
echo "  cd ~/ilia.beer/backend"
echo "  docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d cloudflared"

