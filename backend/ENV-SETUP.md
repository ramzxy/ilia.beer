# Backend Environment Variables Setup

This guide explains how to set up environment variables and required files for your backend.

## Required Files

You need two files in the `backend/` directory:

1. **`.env`** - Database configuration
2. **`GCS.json`** - Google Cloud Storage credentials

## Step 1: Create `.env` File

Create a `.env` file in the `backend/` directory:

```bash
cd ~/ilia.beer/backend
nano .env
```

Add these variables (replace with your actual values):

```env
# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ilia_beer
DB_USERNAME=ilia_user
DB_PASSWORD=your_secure_password_here

# MySQL Root Password (for database container)
MYSQL_ROOT_PASSWORD=your_root_password_here

# Optional: External database port (if you want to access from host)
DB_EXTERNAL_PORT=3306
```

**Important Notes:**
- `DB_HOST=db` - This is the Docker service name, don't change it
- Use strong passwords for `DB_PASSWORD` and `MYSQL_ROOT_PASSWORD`
- The `.env` file is mounted as read-only in Docker

## Step 2: Add GCS.json File

Place your Google Cloud Storage credentials file in the `backend/` directory:

```bash
# Copy your GCS credentials file to the backend directory
cp /path/to/your/GCS.json ~/ilia.beer/backend/GCS.json

# Or if you already have it somewhere, move it:
mv ~/path/to/GCS.json ~/ilia.beer/backend/GCS.json
```

**Security Note:** Make sure `GCS.json` is in your `.gitignore` (it should be already).

## Step 3: Verify Files Exist

```bash
cd ~/ilia.beer/backend
ls -la .env GCS.json
```

You should see both files listed.

## Step 4: Set File Permissions (Optional but Recommended)

```bash
# Make .env readable by Docker
chmod 644 .env

# Make GCS.json readable by Docker
chmod 644 GCS.json
```

## Environment Variables Reference

### Database Variables (Required)

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `DB_HOST` | Database hostname | `db` | `db` (Docker service name) |
| `DB_PORT` | Database port | `3306` | `3306` |
| `DB_DATABASE` | Database name | `ilia_beer` | `ilia_beer` |
| `DB_USERNAME` | Database user | `ilia_user` | `ilia_user` |
| `DB_PASSWORD` | Database password | `secure_password123` | Required |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `root_password123` | Required |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `DB_EXTERNAL_PORT` | Port to expose MySQL on host | `3306` | `3306` |

## How Docker Uses These Files

The `docker-compose.yml` file mounts these files into the containers:

```yaml
volumes:
  - ./.env:/var/www/html/.env:ro          # Read-only mount
  - ./GCS.json:/var/www/html/GCS.json:ro  # Read-only mount
```

The backend PHP code reads from:
- `.env` file → Loaded by `vlucas/phpdotenv` package
- `GCS.json` → Used by Google Cloud Storage client

## Testing Your Setup

After creating the files, test the setup:

```bash
# Start the containers
cd ~/ilia.beer/backend
docker-compose up -d

# Check backend logs
docker logs ilia-beer-backend -f

# Test the API
curl http://localhost:8080/api/videos
```

## Troubleshooting

### "Could not find .env file"
- Make sure `.env` exists in `backend/` directory
- Check file permissions: `ls -la .env`

### "GCS.json not found"
- Verify `GCS.json` is in `backend/` directory
- Check file permissions: `ls -la GCS.json`

### Database Connection Errors
- Verify `DB_HOST=db` (must be the Docker service name)
- Check database container is running: `docker ps | grep ilia-beer-db`
- Check database logs: `docker logs ilia-beer-db`

### Google Cloud Storage Errors
- Verify `GCS.json` contains valid credentials
- Check the file path in `bootstrap.php` matches the mounted path
- Ensure the service account has access to the `ilia_beer` bucket

## Security Best Practices

1. **Never commit `.env` or `GCS.json` to Git**
   - They should be in `.gitignore`
   - Use environment variables or secrets management in production

2. **Use strong passwords**
   - Generate random passwords for database
   - Use a password manager

3. **Restrict file permissions**
   - `.env` and `GCS.json` should be readable only by owner
   - `chmod 600 .env GCS.json` for maximum security

4. **Rotate credentials regularly**
   - Change database passwords periodically
   - Rotate GCS service account keys

## Example `.env` File Template

```env
# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ilia_beer
DB_USERNAME=ilia_user
DB_PASSWORD=ChangeThisToASecurePassword123!

# MySQL Root Password
MYSQL_ROOT_PASSWORD=ChangeThisRootPassword123!

# Optional: External Database Port
DB_EXTERNAL_PORT=3306
```

Copy this template and replace the placeholder passwords with secure ones.

