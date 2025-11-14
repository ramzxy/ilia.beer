#!/bin/bash

# Deploy script for ilia.beer backend
# Pulls changes from GitHub and restarts Docker containers

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory (backend folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  ilia.beer Backend Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

# Check if docker-compose or docker compose is available
DOCKER_COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo -e "${RED}Error: docker-compose is not installed${NC}"
    echo -e "${YELLOW}Please install Docker Compose (V1 or V2)${NC}"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Show which docker compose command we're using
echo -e "${BLUE}ℹ${NC} Using: $DOCKER_COMPOSE_CMD"
echo ""

# Step 1: Check for uncommitted changes
echo -e "${BLUE}Step 1: Checking for uncommitted changes...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
else
    print_status "No uncommitted changes"
fi
echo ""

# Step 2: Pull latest changes from GitHub
echo -e "${BLUE}Step 2: Pulling latest changes from GitHub...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: $CURRENT_BRANCH"

if git pull origin "$CURRENT_BRANCH"; then
    print_status "Successfully pulled latest changes"
else
    print_error "Failed to pull changes"
    exit 1
fi
echo ""

# Step 3: Check if there were actual changes
echo -e "${BLUE}Step 3: Checking for changes...${NC}"
if [ -n "$(git diff HEAD@{1}..HEAD --name-only)" ]; then
    CHANGED_FILES=$(git diff HEAD@{1}..HEAD --name-only)
    print_info "Changed files:"
    echo "$CHANGED_FILES" | sed 's/^/  - /'
    echo ""
else
    print_info "No new changes detected"
    read -p "Continue with rebuild anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
fi
echo ""

# Step 4: Stop existing containers
echo -e "${BLUE}Step 4: Stopping existing containers...${NC}"
if $DOCKER_COMPOSE_CMD down; then
    print_status "Containers stopped"
else
    print_warning "Some containers may not have been running"
fi
echo ""

# Step 5: Rebuild containers (with no cache to ensure fresh build)
echo -e "${BLUE}Step 5: Rebuilding containers...${NC}"
print_info "This may take a few minutes..."
if $DOCKER_COMPOSE_CMD build --no-cache backend; then
    print_status "Backend container rebuilt successfully"
else
    print_error "Failed to rebuild backend container"
    exit 1
fi
echo ""

# Step 6: Start containers
echo -e "${BLUE}Step 6: Starting containers...${NC}"
if $DOCKER_COMPOSE_CMD up -d; then
    print_status "Containers started"
else
    print_error "Failed to start containers"
    exit 1
fi
echo ""

# Step 7: Wait for services to be healthy
echo -e "${BLUE}Step 7: Waiting for services to be ready...${NC}"
print_info "Waiting for database to be healthy..."
sleep 5

MAX_WAIT=60
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if $DOCKER_COMPOSE_CMD ps db | grep -q "healthy"; then
        print_status "Database is healthy"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo -n "."
done
echo ""

if [ $WAITED -ge $MAX_WAIT ]; then
    print_warning "Database health check timeout (but continuing anyway)"
fi

# Step 8: Show container status
echo -e "${BLUE}Step 8: Container status:${NC}"
$DOCKER_COMPOSE_CMD ps
echo ""

# Step 9: Show logs (last 20 lines)
echo -e "${BLUE}Step 9: Recent logs:${NC}"
$DOCKER_COMPOSE_CMD logs --tail=20 backend
echo ""

# Final status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_info "Backend is running on port 8080"
print_info "View logs: $DOCKER_COMPOSE_CMD logs -f backend"
print_info "Stop services: $DOCKER_COMPOSE_CMD down"

