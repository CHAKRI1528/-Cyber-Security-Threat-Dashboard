# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently not implemented. Future versions will include JWT authentication.

## Response Format
All responses are in JSON format:

```json
{
  "success": true,
  "data": {},
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

## Threats Endpoints

### Get All Threats
```
GET /threats
```

Query Parameters:
- `severity` (number): Filter by minimum severity (0-10)
- `type` (string): Filter by threat type
- `source` (string): Filter by data source
- `limit` (number): Results per page (default: 50)
- `page` (number): Page number (default: 1)

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "threatId": "...",
      "type": "malware",
      "source": "virustotal",
      "severity": 8.5,
      "status": "new",
      "title": "Malware Detected",
      "description": "...",
      "confidence": 95
    }
  ],
  "pagination": {}
}
```

### Get Single Threat
```
GET /threats/:id
```

Response: Single threat object

### Update Threat Status
```
PATCH /threats/:id/status
Content-Type: application/json

{
  "status": "investigating"
}
```

Status values: `new`, `investigating`, `resolved`, `ignored`

### Get Threat Analytics
```
GET /threats/analytics/overview
```

Response:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byType": {
      "malware": 50,
      "ip_reputation": 75,
      "vulnerability": 25
    },
    "bySeverity": {
      "critical": 10,
      "high": 40,
      "medium": 80,
      "low": 20,
      "info": 0
    },
    "byStatus": {
      "new": 50,
      "investigating": 60,
      "resolved": 40,
      "ignored": 0
    }
  }
}
```

## Alerts Endpoints

### Get All Alerts
```
GET /alerts
```

Query Parameters:
- `severity` (string): critical, high, medium, low, info
- `status` (string): active, acknowledged, resolved
- `limit` (number): Results per page (default: 50)
- `page` (number): Page number (default: 1)

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "alertId": "...",
      "threatId": "...",
      "severity": "high",
      "title": "Alert Title",
      "message": "Alert details",
      "status": "active",
      "priority": 4,
      "recommendations": [
        "Action 1",
        "Action 2"
      ]
    }
  ]
}
```

### Get Active Alerts
```
GET /alerts/active
```

Returns only alerts with `status: "active"`

### Acknowledge Alert
```
PATCH /alerts/:id/acknowledge
Content-Type: application/json

{
  "acknowledgedBy": "John Doe"
}
```

### Resolve Alert
```
PATCH /alerts/:id/resolve
```

Changes alert status to `resolved`

### Get Alert Statistics
```
GET /alerts/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "active": 15,
    "acknowledged": 30,
    "resolved": 120,
    "bySeverity": [
      {
        "_id": "critical",
        "count": 5
      }
    ]
  }
}
```

## Statistics Endpoints

### Get Statistics
```
GET /stats
```

Response: Latest ThreatStats document

### Get Threat Trends
```
GET /stats/trends?days=7
```

Query Parameters:
- `days` (number): Number of days to analyze (default: 7)

### Get Dashboard Overview
```
GET /stats/dashboard/overview
```

Response:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalThreats": 150,
      "activeAlerts": 20,
      "resolvedAlerts": 130,
      "averageSeverity": "6.75"
    },
    "threatDistribution": {
      "byType": {},
      "bySeverity": {},
      "bySource": {}
    },
    "trends": [],
    "lastUpdated": "2024-01-01T12:00:00Z"
  }
}
```

## Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid parameters"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Details in development mode"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## WebSocket Events

### Client Events
- `subscribe-threats`: Subscribe to threat channel
- `subscribe-alerts`: Subscribe to alerts channel

### Server Events
- `new-threat`: New threat detected
- `new-alert`: New alert generated
- `stats-update`: Statistics updated

### Example
```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  socket.emit('subscribe-threats');
});

socket.on('new-threat', (data) => {
  console.log('New threat:', data);
});
```

## Pagination

All list endpoints support pagination:

```
GET /threats?page=2&limit=25
```

Response includes pagination metadata:
```json
{
  "pagination": {
    "total": 500,
    "page": 2,
    "limit": 25,
    "pages": 20
  }
}
```

## Filtering Examples

### Get Critical Threats
```
GET /threats?severity=9&limit=50
```

### Get Unresolved Malware
```
GET /threats?type=malware&status=new
```

### Get Recent High-Priority Alerts
```
GET /alerts?severity=high&status=active
```

## Sorting

Currently, results are sorted by:
- Threats: `createdAt` (descending)
- Alerts: `createdAt` (descending)

Future versions will support configurable sorting.

## Version Information

API Version: 1.0.0
Last Updated: January 2024
