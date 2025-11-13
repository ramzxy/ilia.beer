# Cloudflare Tunnel Setup for Raspberry Pi

This guide will help you expose your backend API to the internet using Cloudflare Tunnel, which works perfectly behind student network firewalls.

## Prerequisites

1. A Cloudflare account (free)
2. A domain name (you can use a free subdomain from Cloudflare or your own domain)

## Step 1: Install Cloudflared on Your Pi

```bash
# Download cloudflared for ARM64 (Raspberry Pi 4/5)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb

# Install it
sudo dpkg -i cloudflared-linux-arm64.deb

# For ARM32 (older Pi models), use:
# wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm
# sudo mv cloudflared-linux-arm /usr/local/bin/cloudflared
# sudo chmod +x /usr/local/bin/cloudflared
```

## Step 2: Login to Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser window. Select your domain and authorize the tunnel.

## Step 3: Create a Tunnel

```bash
cloudflared tunnel create ilia-beer-backend
```

This will create a tunnel and save credentials. Note the tunnel ID that's displayed.

## Step 4: Create DNS Record

```bash
# Replace YOUR_DOMAIN with your actual domain (e.g., api.yourdomain.com)
cloudflared tunnel route dns ilia-beer-backend api.yourdomain.com
```

Or manually create a CNAME record in Cloudflare DNS:
- Type: CNAME
- Name: api (or whatever subdomain you want)
- Target: [TUNNEL_ID].cfargotunnel.com
- Proxy: Proxied (orange cloud)

## Step 5: Create Config File

Create `/home/pi/.cloudflared/config.yml`:

```yaml
tunnel: [YOUR_TUNNEL_ID]
credentials-file: /home/pi/.cloudflared/[TUNNEL_ID].json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:8080
  - service: http_status:404
```

Replace:
- `[YOUR_TUNNEL_ID]` with the tunnel ID from step 3
- `api.yourdomain.com` with your subdomain
- `localhost:8080` with your backend port (matches docker-compose.yml)

## Step 6: Run Cloudflared as a Service

Create systemd service file `/etc/systemd/system/cloudflared.service`:

```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=pi
ExecStart=/usr/local/bin/cloudflared tunnel --config /home/pi/.cloudflared/config.yml run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

## Step 7: Update Frontend

Update your frontend's `.env.local` or environment variable:

```
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

## Alternative: Docker Compose Method

You can also run cloudflared as a Docker container. See `docker-compose.tunnel.yml` for this option.

## Troubleshooting

- Check tunnel status: `cloudflared tunnel info ilia-beer-backend`
- View logs: `sudo journalctl -u cloudflared -f`
- Test locally: `curl http://localhost:8080/api/videos`

