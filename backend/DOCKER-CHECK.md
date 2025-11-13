# Docker Status Check Commands

## Quick Status Check

```bash
# Check all containers are running
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml ps

# Or if you're in the backend directory:
cd ~/ilia.beer/backend
docker-compose ps
```

## Check Container Logs

### Backend Logs
```bash
docker logs ilia-beer-backend -f
```

### Database Logs
```bash
docker logs ilia-beer-db -f
```

### Cloudflare Tunnel Logs
```bash
docker logs ilia-beer-tunnel -f
```

## Test Backend Locally

```bash
# Test backend API (should work if backend is running)
curl http://localhost:8080/api/videos

# Or test with a browser
# Open: http://localhost:8080/api/videos
```

## Test Tunnel Connection

```bash
# Check tunnel is connected (look for "Connected" in logs)
docker logs ilia-beer-tunnel | grep -i connected

# Test through tunnel URL (replace with your actual subdomain)
curl https://api.yourdomain.com/api/videos
```

## Check Container Health

```bash
# Detailed container info
docker inspect ilia-beer-backend
docker inspect ilia-beer-db
docker inspect ilia-beer-tunnel

# Check network connectivity
docker network inspect backend_ilia-beer-network
```

## Common Issues

### Backend not responding?
```bash
# Check backend logs for errors
docker logs ilia-beer-backend --tail 50

# Check if backend container is running
docker ps | grep ilia-beer-backend
```

### Tunnel not connecting?
```bash
# Check tunnel logs
docker logs ilia-beer-tunnel --tail 50

# Look for errors or connection status
docker logs ilia-beer-tunnel | grep -i error
docker logs ilia-beer-tunnel | grep -i "cannot"
```

### Database connection issues?
```bash
# Check database logs
docker logs ilia-beer-db --tail 50

# Test database connection from backend container
docker exec ilia-beer-backend php -r "try { \$pdo = new PDO('mysql:host=db;dbname=ilia_beer', 'ilia_user', 'ilia_password'); echo 'Connected!'; } catch (Exception \$e) { echo \$e->getMessage(); }"
```

## Restart Services

```bash
# Restart everything
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml restart

# Restart specific service
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml restart backend
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml restart cloudflared
```

## Stop Everything

```bash
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml down
```

## Start Everything

```bash
docker-compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d
```

