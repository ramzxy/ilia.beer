#!/bin/bash

# Quick setup script for backend environment variables

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$BACKEND_DIR/.env"

echo "=== Backend Environment Setup ==="
echo ""

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Keeping existing .env file"
        exit 0
    fi
fi

# Generate random passwords
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
ROOT_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo "Generating secure passwords..."
echo ""

# Create .env file
cat > "$ENV_FILE" << EOF
# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ilia_beer
DB_USERNAME=ilia_user
DB_PASSWORD=$DB_PASSWORD

# MySQL Root Password
MYSQL_ROOT_PASSWORD=$ROOT_PASSWORD

# Optional: External database port
DB_EXTERNAL_PORT=3306
EOF

echo "✅ Created .env file at $ENV_FILE"
echo ""
echo "Generated passwords:"
echo "  DB_PASSWORD: $DB_PASSWORD"
echo "  MYSQL_ROOT_PASSWORD: $ROOT_PASSWORD"
echo ""
echo "⚠️  IMPORTANT: Save these passwords securely!"
echo ""

# Check for GCS.json
if [ ! -f "$BACKEND_DIR/GCS.json" ]; then
    echo "⚠️  GCS.json not found!"
    echo "Please add your Google Cloud Storage credentials file:"
    echo "  cp /path/to/your/GCS.json $BACKEND_DIR/GCS.json"
    echo ""
else
    echo "✅ GCS.json found"
fi

# Set permissions
chmod 600 "$ENV_FILE"
if [ -f "$BACKEND_DIR/GCS.json" ]; then
    chmod 600 "$BACKEND_DIR/GCS.json"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. If you haven't already, add GCS.json to $BACKEND_DIR/"
echo "2. Review the .env file and adjust if needed"
echo "3. Start your containers: docker-compose up -d"
echo ""

