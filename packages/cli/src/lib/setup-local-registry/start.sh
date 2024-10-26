#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Find the base directory (project_home)
BASE_DIR="$SCRIPT_DIR"
while [[ "$BASE_DIR" != "/" && ! -f "$BASE_DIR/.env.local" ]]; do
    BASE_DIR="$(dirname "$BASE_DIR")"
done

# Change to the script directory
cd "$SCRIPT_DIR"

# Function to source environment variables
source_env() {
    if [ -f "$1" ]; then
        export $(grep -v '^#' "$1" | xargs)
    fi
}

# Source .env.local from the base directory, then .env from the script directory
source_env "$BASE_DIR/.env.local"
source_env "$SCRIPT_DIR/.env"

# Set default values if not found in .env files
DEFAULT_USER="${DEFAULT_USER:-admin}"
DEFAULT_PASS="${DEFAULT_PASS:-admin123}"
DEFAULT_EMAIL="${DEFAULT_EMAIL:-admin@example.com}"

# Stop and remove existing container if it exists
docker stop verdaccio-registry 2>/dev/null
docker rm verdaccio-registry 2>/dev/null

# Remove existing image if it exists
docker rmi verdaccio-image 2>/dev/null

# Check if Dockerfile exists
if [ ! -f "$SCRIPT_DIR/Dockerfile" ]; then
    echo "Error: Dockerfile not found in $SCRIPT_DIR"
    exit 1
fi

# Check if config.yaml exists
if [ ! -f "$SCRIPT_DIR/config.yaml" ]; then
    echo "Error: config.yaml not found in $SCRIPT_DIR"
    exit 1
fi

# Build the Docker image
docker build -t verdaccio-image "$SCRIPT_DIR"

# Get the port number (use default 4873 if not specified)
PORT=${1:-4873}

# Get the absolute path of the storage directory
STORAGE_PATH="$SCRIPT_DIR/verdaccio-storage"

# Create the storage directory if it doesn't exist
mkdir -p "$STORAGE_PATH"

# Run the Docker container
docker run -d --name verdaccio-registry \
  -p $PORT:4873 \
  -v "$STORAGE_PATH:/verdaccio-storage" \
  -e VERDACCIO_PORT=4873 \
  -e DEFAULT_USER="$DEFAULT_USER" \
  -e DEFAULT_PASS="$DEFAULT_PASS" \
  -e DEFAULT_EMAIL="$DEFAULT_EMAIL" \
  verdaccio-image

# Wait for the container to start
sleep 5

# Set up non-interactive authentication
AUTH_TOKEN=$(docker exec verdaccio-registry /bin/sh -c "
    npm config set //localhost:4873/:_authToken \"\"
    npm config set //localhost:4873/:always-auth false
    (echo '$DEFAULT_USER'; echo '$DEFAULT_PASS'; echo '$DEFAULT_EMAIL') | npm adduser --registry http://localhost:4873 --scope @adenta
    npm config get //localhost:4873/:_authToken
")

# Update ~/.npmrc with the new authentication token
NPMRC_FILE="$HOME/.npmrc"
REGISTRY_URL="http://localhost:$PORT"

# Remove existing @adenta:registry and //localhost:$PORT/:_authToken lines
sed -i.bak '/^@adenta:registry/d' "$NPMRC_FILE"
sed -i.bak "\|^//localhost:$PORT/:_authToken|d" "$NPMRC_FILE"

# Add new @adenta:registry and //localhost:$PORT/:_authToken lines
echo "@adenta:registry=$REGISTRY_URL" >> "$NPMRC_FILE"
echo "//localhost:$PORT/:_authToken=$AUTH_TOKEN" >> "$NPMRC_FILE"

echo "Updated ~/.npmrc with authentication for @adenta scope"

# Open Google Chrome with the Verdaccio URL
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open -a "Google Chrome" "$REGISTRY_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  google-chrome "$REGISTRY_URL"
else
  echo "Unsupported operating system. Please open Google Chrome manually and navigate to $REGISTRY_URL"
fi

# Display the container logs
docker logs -f verdaccio-registry