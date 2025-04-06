#!/bin/bash

# Get the environment (default to "dev" if not provided)
ENV=${1:-dev}

# URL of your Supabase bucket (public bucket)
BASE_URL="https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/sign/env-files"
TOKEN="token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJlbnYtZmlsZXMvZGV2Ly5lbnYuZGV2IiwiaWF0IjoxNzQzOTQyOTI4LCJleHAiOjE3NzU0Nzg5Mjh9.fTpcaD-6x6BDnzdWlr4PkJ1qwSSTRsi25aJ9R00mKiw"

# Compose full URL for the env file
ENV_URL="$BASE_URL/$ENV/.env.$ENV?$TOKEN"

echo "Downloading .env.$ENV..."
curl -s -o .env "$ENV_URL"

echo ".env file downloaded. Starting build..."

npm install
npm run build

echo "✅ Build finished for $ENV environment."
