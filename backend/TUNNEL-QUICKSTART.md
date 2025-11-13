# Quick Start: Expose Backend on Student Network

Since you're behind a student network firewall, you need a tunnel service. Here are your options:

## Option 1: Cloudflare Tunnel (Recommended - Free & Stable)

**Best for**: Production use, stable URLs, free custom domains

### Quick Setup:

1. **Run the automated script**:
```bash
cd backend
chmod +x setup-tunnel.sh
./setup-tunnel.sh
```

2. **Or follow manual steps** (see `cloudflared-setup.md`)

### What you need:
- Cloudflare account (free)
- A domain (you can use a free subdomain or your own)

### Result:
- Stable URL like `https://api.yourdomain.com`
- Works behind any firewall
- Free forever

---

## Option 2: ngrok (Quick & Easy)

**Best for**: Quick testing, temporary URLs

### Quick Setup:

```bash
# Install
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz
tar xvzf ngrok-v3-stable-linux-arm64.tgz
sudo mv ngrok /usr/local/bin/

# Sign up at ngrok.com and get authtoken
ngrok config add-authtoken YOUR_TOKEN

# Run tunnel
ngrok http 8080
```

### Result:
- Temporary URL like `https://abc123.ngrok-free.app`
- URL changes on restart (free plan)
- Very quick to set up

See `ngrok-alternative.md` for full details.

---

## Option 3: Tailscale (VPN Solution)

**Best for**: Personal use, secure access

1. Install Tailscale on Pi and your devices
2. Access via Tailscale IP (e.g., `http://100.x.x.x:8080`)
3. No public internet exposure needed

---

## After Setup

Once you have your public URL, update your frontend:

1. **Create/update** `beerfront/.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=https://your-tunnel-url.com
```

2. **Restart your frontend** to pick up the new URL

---

## Testing

Test your backend is accessible:
```bash
curl https://your-tunnel-url.com/api/videos
```

You should get a JSON response with your videos.

---

## Troubleshooting

- **Backend not accessible**: Make sure Docker containers are running (`docker-compose ps`)
- **Tunnel not connecting**: Check tunnel logs (`sudo journalctl -u cloudflared -f`)
- **CORS errors**: Your backend already has CORS headers configured, should work fine

