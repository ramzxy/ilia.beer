# ngrok Alternative Setup

If you prefer ngrok over Cloudflare Tunnel, here's how to set it up.

## Installation

```bash
# Download ngrok for ARM64
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz

# Extract
tar xvzf ngrok-v3-stable-linux-arm64.tgz
sudo mv ngrok /usr/local/bin/

# For ARM32 (older Pi):
# wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm.tgz
```

## Setup

1. Sign up at https://ngrok.com (free account)
2. Get your authtoken from the dashboard
3. Configure: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

## Run Tunnel

```bash
# Basic usage (temporary URL)
ngrok http 8080

# With custom domain (paid plan)
ngrok http 8080 --domain=your-domain.ngrok-free.app
```

## Run as Service

Create `/etc/systemd/system/ngrok.service`:

```ini
[Unit]
Description=ngrok tunnel
After=network.target

[Service]
Type=simple
User=pi
ExecStart=/usr/local/bin/ngrok http 8080 --log=stdout
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable ngrok
sudo systemctl start ngrok
```

## Get Public URL

```bash
# Get the public URL
curl http://localhost:4040/api/tunnels | jq '.tunnels[0].public_url'
```

## Update Frontend

Use the ngrok URL in your frontend:
```
NEXT_PUBLIC_BACKEND_URL=https://your-random-id.ngrok-free.app
```

**Note**: Free ngrok URLs change on restart. For a stable URL, use Cloudflare Tunnel or upgrade to ngrok paid plan.

