# Cyber Threat Monitoring System

A real-time cybersecurity threat monitoring platform that integrates with multiple threat intelligence sources and provides real-time alerts and analytics.

## Features

- 🔍 **Real-time Threat Monitoring** - Continuous threat detection and monitoring
- 📊 **Advanced Analytics** - Threat distribution charts and statistics
- 🚨 **Alert Management** - Dynamic alert creation and management with recommendations
- 🔗 **Multi-Source Integration** - AbuseIPDB, VirusTotal, Shodan, MISP
- 📡 **WebSocket Real-Time Updates** - Live threat and alert notifications
- 📱 **Responsive Dashboard** - Full-featured web interface
- 🛡️ **Security Best Practices** - Rate limiting, CORS, Helmet security headers

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Security**: Helmet, Rate Limiting

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose

## Architecture

```
┌─────────────────────────────────────────┐
│      React Frontend (Port 3000)         │
│  - Dashboard                            │
│  - Threat Monitoring                    │
│  - Alert Management                     │
└──────────────┬──────────────────────────┘
               │ WebSocket/REST
┌──────────────▼──────────────────────────┐
│    Node.js Backend (Port 5000)          │
│  - REST API                             │
│  - WebSocket Server                     │
│  - Threat Monitoring Service            │
│  - Alert Service                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    MongoDB (Port 27017)                 │
│  - Threats Collection                   │
│  - Alerts Collection                    │
│  - Statistics Collection                │
└─────────────────────────────────────────┘
       │
       ├─ AbuseIPDB API
       ├─ VirusTotal API
       ├─ Shodan API
       └─ MISP Platform
```

## Project Structure

```
cyber-threat-monitoring/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── server.js        # Main entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation

### Prerequisites
- Docker & Docker Compose
- or Node.js 18+ and MongoDB locally

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
cd cyber-threat-monitoring

# Create environment file
cp backend/.env.example backend/.env

# Edit .env with your API keys
# ABUSEIPDB_API_KEY=your_key
# VIRUSTOTAL_API_KEY=your_key
# SHODAN_API_KEY=your_key

# Build and run
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

### Option 2: Local Installation

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with MongoDB URI and API keys

# Start MongoDB locally
# (ensure MongoDB is running on port 27017)

# Run the server
npm start
# or for development with auto-reload
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

# The app will open at http://localhost:3000
```

## API Endpoints

### Threats
- `GET /api/threats` - Get all threats (with filters)
- `GET /api/threats/:id` - Get single threat
- `PATCH /api/threats/:id/status` - Update threat status
- `GET /api/threats/analytics/overview` - Get threat analytics
- `GET /api/threats/analytics/latest` - Get latest threats
- `GET /api/threats/analytics/stats` - Get threat statistics

### Alerts
- `GET /api/alerts` - Get all alerts (with filters)
- `GET /api/alerts/active` - Get active alerts
- `GET /api/alerts/stats` - Get alert statistics
- `PATCH /api/alerts/:id/acknowledge` - Acknowledge alert
- `PATCH /api/alerts/:id/resolve` - Resolve alert

### Statistics
- `GET /api/stats` - Get statistics
- `GET /api/stats/trends` - Get threat trends
- `GET /api/stats/dashboard/overview` - Get dashboard overview

### Health
- `GET /api/health` - Health check

## Real-Time Features

### WebSocket Events

**Client → Server:**
- `subscribe-threats` - Subscribe to threat updates
- `subscribe-alerts` - Subscribe to alert updates

**Server → Client:**
- `new-threat` - New threat detected
- `new-alert` - New alert generated
- `stats-update` - Statistics updated

## Threat Intelligence Integration

### AbuseIPDB
- IP reputation scoring
- Abuse history tracking
- Malicious IP detection

### VirusTotal
- File hash analysis
- URL reputation checking
- Malware detection

### Shodan
- Internet-connected device discovery
- Exposed service detection
- Vulnerability identification

### MISP
- Structured threat sharing
- Event correlation
- Indicator of Compromise (IoC) tracking

## Alert Recommendations

The system automatically generates context-aware recommendations based on threat type and severity:

- **Malware Threats**: Isolation, scanning, log analysis
- **IP Reputation**: Firewall blocking, traffic monitoring
- **Vulnerabilities**: Patching, compensating controls
- **Network Anomalies**: Traffic investigation, IDS monitoring

## Monitoring Schedule

- **Threat Checks**: Every 5 minutes
- **Statistics Update**: Every 10 minutes
- **Data Retention**: 30-90 days (configurable via TTL indexes)

## Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cyber-threat-monitoring

# APIs
ABUSEIPDB_API_KEY=your_key
VIRUSTOTAL_API_KEY=your_key
SHODAN_API_KEY=your_key
MISP_URL=https://your_instance.com
MISP_API_KEY=your_key

# Frontend
FRONTEND_URL=http://localhost:3000

# Monitoring
THREAT_CHECK_INTERVAL=300000
ALERT_THRESHOLD=7.5
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm install --production

# Frontend
cd frontend
npm run build
```

## Performance Optimization

- Database indexing on frequently queried fields
- MongoDB TTL indexes for automatic data cleanup
- Socket.io room-based broadcasting for targeted updates
- Redis caching support (configured in docker-compose)
- Pagination support for large datasets

## Security Considerations

- Rate limiting on API endpoints (100 requests per 15 minutes)
- CORS configuration for frontend origin
- Helmet.js for HTTP security headers
- MongoDB user authentication
- API key rotation recommendations
- Data encryption in transit (HTTPS in production)

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend not connecting to Backend
- Check if backend is running: `http://localhost:5000/api/health`
- Verify CORS configuration in backend
- Check browser console for network errors

### No synthetic threats appearing
- Check backend logs: `docker logs cyber-threat-backend`
- Verify threat monitoring service is running
- Check database is accessible

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit changes (`git commit -am 'Add enhancement'`)
4. Push to branch (`git push origin feature/enhancement`)
5. Create Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue or contact the development team.

## Roadmap

- [ ] Machine learning-based threat prediction
- [ ] Custom threat feed integration
- [ ] Advanced SIEM integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-powered incident response recommendations
- [ ] Custom alert rules builder
- [ ] Threat intelligence sharing
- [ ] Forensic evidence collection
- [ ] Automated remediation workflows

---

**CyberGuard** - Protecting your digital assets in real-time.
