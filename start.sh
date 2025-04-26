#!/bin/bash

# Get the environment (default to "dev" if not provided)
ENV=${1:-dev}

# URL of your Supabase bucket (public bucket)
BASE_URL="https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/sign/env-files"

# Check if TOKEN is set
if [ -z "$TOKEN" ]; then
    echo "❌ Error: TOKEN environment variable is not set"
    exit 1
fi

# Compose full URL for the env file
ENV_URL="$BASE_URL/$ENV/.env.$ENV?$TOKEN"

echo "Downloading .env.$ENV..."
curl -s -o .env "$ENV_URL"

# Check if curl command was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to download .env file"
    exit 1
fi

# Check if .env file exists and is not empty
if [ ! -f .env ]; then
    echo "❌ Error: .env file was not created"
    exit 1
fi

if [ ! -s .env ]; then
    echo "❌ Error: .env file is empty"
    exit 1
fi

# Check for required environment variables
REQUIRED_VARS=(
    "VITE_SUPABASE_ANON_KEY"
    "VITE_SUPABASE_URL"
    "VITE_HOMEPAGE_BACKGROUND_IMAGE"
    "VITE_POPULAR_DESTINATION_LADAKH_IMAGE"
    "VITE_POPULAR_DESTINATION_VARANASI_IMAGE"
    "VITE_POPULAR_DESTINATION_GOA_IMAGE"
    "VITE_POPULAR_DESTINATION_JAIPUR_IMAGE"
    "VITE_POPULAR_DESTINATION_KERALA_IMAGE"
    "VITE_POPULAR_DESTINATION_MANALI_IMAGE"
    "VITE_WHATSAPP_LINK"
    "VITE_WHATSAPP_NUMBER"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Error: Missing required environment variables:"
    printf '%s\n' "${MISSING_VARS[@]}"
    exit 1
fi

echo "✅ Environment file downloaded and validated successfully"
echo "Starting build..."

npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: npm install failed"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "✅ Build finished for $ENV environment."
