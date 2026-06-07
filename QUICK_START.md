# Quick Start Guide for Cyber Threat Monitoring System

## Prerequisites
- Docker & Docker Compose installed
- API keys (optional, but recommended):
  - AbuseIPDB
  - VirusTotal
  - Shodan

## Setup Instructions

### 1. Clone/Setup the Project
```bash
cd cyber-threat-monitoring
```

### 2. Configure Environment
```bash
# Copy the environment template
cp backend/.env.example backend/.env

# Edit backend/.env and add your API keys (optional):
# - ABUSEIPDB_API_KEY
# - VIRUSTOTAL_API_KEY
# - SHODAN_API_KEY
# - MISP_URL / MISP_API_KEY
```

### 3. Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Access the Dashboard
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 5. Stop Services
```bash
docker-compose down

# Remove volumes (MongoDB data)
docker-compose down -v
```

## Using Without Docker

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Requirements
- Node.js 18+
- MongoDB 5+ running locally on port 27017

## Features Overview

### Dashboard
- Real-time threat statistics
- Threat distribution charts
- Active alerts panel
- Latest threats listing

### Threat Monitoring
- Filter by severity, type, source
- Real-time updates via WebSocket
- 5-minute scanning intervals
- Multiple data source integration

### Alert Management
- Dynamic alert recommendations
- Acknowledge/Resolve workflow
- Severity-based prioritization
- Real-time notifications

## Demo Mode

The system comes with **synthetic threat generation** enabled by default:
- Generates realistic threat data
- Demonstrates all features
- Perfect for testing and demos
- No API keys required

To integrate real threat sources, add API keys to `.env` file.

## Monitoring Dashboard Metrics

- **Total Threats**: All detected threats
- **Active Alerts**: Pending alerts requiring action
- **Resolved**: Completed incident count
- **Avg Severity**: Average threat severity score (0-10)

## Common Tasks

### View Backend Logs
```bash
docker-compose logs -f backend
```

### Access MongoDB
```bash
docker-compose exec mongodb mongosh -u cyber_user -p secure_password --authenticationDatabase admin
```

### Reset System
```bash
# Stop and remove everything
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Scale Services (Production)
```bash
# In docker-compose.yml, add multiple replicas:
services:
  backend:
    deploy:
      replicas: 3
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000/5000 already in use | Change ports in docker-compose.yml |
| MongoDB connection fails | Ensure MongoDB is running: `docker-compose ps` |
| Frontend can't connect to API | Check CORS settings, verify backend health |
| No threats appearing | Backend might be initializing, wait 30 seconds |

## Security Notes

- Change default MongoDB credentials in production
- Use HTTPS in production environment
- Store API keys securely (use secrets management)
- Enable authentication on API endpoints
- Implement VPN/private network for sensitive deployments

## Next Steps

1. ✅ System is running
2. ✅ Dashboard is accessible
3. 📊 Monitor threats in real-time
4. 🔑 Add your API keys for real data
5. 🎛️ Configure alert thresholds
6. 📢 Set up notifications (email, Slack)

## Support

For detailed documentation, see [README.md](../README.md)

Happy monitoring! 🛡️
