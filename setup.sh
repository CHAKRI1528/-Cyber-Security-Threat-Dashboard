#!/bin/bash

# Cyber Threat Monitoring System - Setup Script
# This script sets up the entire project

set -e

echo "🛡️  Cyber Threat Monitoring System - Setup"
echo "==========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✓ Docker detected"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker Compose detected"
echo ""

# Create environment file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env - Please update with your API keys"
else
    echo "✓ backend/.env already exists"
fi

echo ""

# Create frontend environment file if needed
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend/.env.local from template..."
    cp frontend/.env.local.example frontend/.env.local
    echo "✓ Created frontend/.env.local"
else
    echo "✓ frontend/.env.local already exists"
fi

echo ""
echo "🐳 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/api"
echo ""
echo "📊 Dashboard:"
echo "   http://localhost:3000"
echo ""
echo "🔍 Check logs:"
echo "   Backend:  docker-compose logs -f backend"
echo "   Frontend: docker-compose logs -f frontend"
echo "   MongoDB:  docker-compose logs -f mongodb"
echo ""
echo "⏹️  To stop services:"
echo "   docker-compose down"
echo ""
echo "📚 Documentation:"
echo "   - README.md: Full documentation"
echo "   - QUICK_START.md: Quick setup guide"
echo "   - API_DOCS.md: API reference"
echo "   - DEPLOYMENT.md: Production deployment"
echo ""
