# Docker Setup with Cloudflare Tunnel

This guide shows you how to run cloudflared as part of your Docker setup.

## Step 1: Create Config File

First, create the config file on your Pi:

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this (replace `api.yourdomain.com` with your actual subdomain):

```yaml
tunnel: 0a3a87bd-eea9-4613-a61b-8bdad26a4090
credentials-file: /etc/cloudflared/0a3a87bd-eea9-4613-a61b-8bdad26a4090.json

ingress:
  - hostname: api.yourdomain.com
    service: http://backend:80
  - service: http_status:404
```

**Important**: Notice `service: http://backend:80` - this uses the Docker service name `backend` instead of `localhost:8080` because containers communicate via Docker network.

Save and exit (Ctrl+X, Y, Enter).

## Step 2: Create DNS Route

Set up your subdomain:

```bash
cloudflared tunnel route dns ilia-beer-backend api.yourdomain.com
```

Replace `api.yourdomain.com` with your actual subdomain.

## Step 3: Start Everything with Docker Compose

Now start both the backend and tunnel together:

```bash
cd ~/ilia.beer/backend
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d
```

This will:
- Start MySQL database
- Start PHP backend
- Start Cloudflare Tunnel

## Step 4: Check Status

```bash
# Check all containers
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml ps

# Check tunnel logs
docker logs ilia-beer-tunnel -f

# Check backend logs
docker logs ilia-beer-backend -f
```

## Step 5: Test

Test your backend through the tunnel:

```bash
curl https://api.yourdomain.com/api/videos
```

## Updating Config

If you need to change the config file:

1. Edit `~/.cloudflared/config.yml`
2. Restart the tunnel:
```bash
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml restart cloudflared
```

## Benefits of Docker Approach

- ✅ Everything runs in containers (cleaner)
- ✅ Easy to start/stop everything together
- ✅ Automatic restarts on failure
- ✅ No need to install cloudflared on the host system
- ✅ Easy to update (just pull new image)

## Troubleshooting

**Tunnel not connecting?**
```bash
docker logs ilia-beer-tunnel
```

**Backend not accessible?**
```bash
# Test backend directly (should work)
curl http://localhost:8080/api/videos

# Check backend logs
docker logs ilia-beer-backend
```

**Config file issues?**
- Make sure the tunnel ID matches in config.yml
- Verify credentials file path is correct
- Check file permissions: `ls -la ~/.cloudflared/`

