#!/bin/bash

# Fix GCS.json if it's a directory

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GCS_PATH="$BACKEND_DIR/GCS.json"

echo "Checking GCS.json..."

if [ -d "$GCS_PATH" ]; then
    echo "⚠️  GCS.json is a directory, not a file!"
    echo ""
    echo "Contents of GCS.json directory:"
    ls -la "$GCS_PATH"
    echo ""
    
    # Check if there's a JSON file inside
    JSON_FILE=$(find "$GCS_PATH" -name "*.json" -type f | head -1)
    
    if [ -n "$JSON_FILE" ]; then
        echo "Found JSON file inside: $JSON_FILE"
        read -p "Do you want to use this file as GCS.json? (y/n): " USE_FILE
        if [ "$USE_FILE" = "y" ]; then
            echo "Backing up directory..."
            mv "$GCS_PATH" "${GCS_PATH}.backup"
            echo "Copying JSON file..."
            cp "$JSON_FILE" "$GCS_PATH"
            echo "✅ Fixed! GCS.json is now a file"
            chmod 600 "$GCS_PATH"
        fi
    else
        echo "No JSON file found inside the directory."
        echo ""
        read -p "Do you want to remove the directory and create a placeholder? (y/n): " REMOVE_DIR
        if [ "$REMOVE_DIR" = "y" ]; then
            echo "Backing up directory..."
            mv "$GCS_PATH" "${GCS_PATH}.backup"
            echo ""
            echo "⚠️  You need to add your GCS credentials file:"
            echo "  cp /path/to/your/gcs-credentials.json $GCS_PATH"
        fi
    fi
elif [ -f "$GCS_PATH" ]; then
    echo "✅ GCS.json is a file (correct)"
    echo "File size: $(stat -f%z "$GCS_PATH" 2>/dev/null || stat -c%s "$GCS_PATH") bytes"
else
    echo "❌ GCS.json does not exist"
    echo ""
    echo "You need to add your Google Cloud Storage credentials:"
    echo "  cp /path/to/your/gcs-credentials.json $GCS_PATH"
    echo "  chmod 600 $GCS_PATH"
fi

