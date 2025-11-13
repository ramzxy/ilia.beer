# Cloudflare Login Troubleshooting

If `cloudflared tunnel login` is stuck on "Waiting for login..." after you've logged in:

## Quick Fix

1. **Press `Ctrl+C`** to cancel the waiting process

2. **Check if login worked**:
```bash
ls -la ~/.cloudflared/
```

You should see a file like `cert.pem` or similar. If you see it, login was successful!

3. **If login worked**, continue with creating the tunnel:
```bash
cloudflared tunnel create ilia-beer-backend
```

## If Login Didn't Work

If you don't see the credentials file:

1. **Try login again** (sometimes the browser callback fails):
```bash
cloudflared tunnel login
```

2. **Make sure you**:
   - Selected the correct domain in the browser
   - Clicked "Authorize" or "Allow"
   - The browser window shows "Success" or similar

3. **Alternative: Manual token method**:
   - Go to Cloudflare Dashboard → Zero Trust → Networks → Tunnels
   - Create a tunnel manually
   - Copy the token
   - Use: `cloudflared tunnel run --token YOUR_TOKEN`

## Continue Setup

Once login is confirmed, proceed with:

```bash
# Create tunnel
cloudflared tunnel create ilia-beer-backend

# Note the tunnel ID that appears (looks like: abc12345-6789-...)

# Create DNS route (replace with your subdomain)
cloudflared tunnel route dns ilia-beer-backend api.yourdomain.com

# Create config file
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Then paste this config (replace YOUR_TUNNEL_ID and your subdomain):
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/pi/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:8080
  - service: http_status:404
```

Save and continue with the rest of the setup!

