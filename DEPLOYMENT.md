# Deployment Guide

## Production Deployment

### Prerequisites
- Verified API keys for threat intelligence sources
- SSL/TLS certificates
- Production MongoDB instance
- Load balancer (optional)

### 1. Environment Setup

Update `.env` with production values:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cyber-threat-monitoring
FRONTEND_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# Production API Keys
ABUSEIPDB_API_KEY=your_production_key
VIRUSTOTAL_API_KEY=your_production_key
SHODAN_API_KEY=your_production_key
```

### 2. Database Migration

```bash
# Create MongoDB Atlas instance
# Create admin user
# Enable backups
# configure network access whitelist
```

### 3. Docker Deployment

```bash
# Build images
docker build -t cyber-threat-backend:prod ./backend
docker build -t cyber-threat-frontend:prod ./frontend

# Push to registry
docker tag cyber-threat-backend:prod your-registry/cyber-threat-backend:latest
docker push your-registry/cyber-threat-backend:latest
```

### 4. Kubernetes Deployment

```yaml
# Recommended: Use Kubernetes for production
# See kubernetes/ directory for manifests
```

### 5. Monitoring & Logging

- ELK Stack for centralized logging
- Prometheus for metrics
- Grafana for visualization
- Sentry for error tracking

### 6. Backup Strategy

- Daily MongoDB backups
- 30-day retention
- Test restore procedures

### 7. Security Hardening

- Enable HTTPS/TLS
- Configure firewall rules
- Implement WAF (Web Application Firewall)
- Enable audit logging
- Regular security audits

### 8. Performance Tuning

- Enable Redis caching
- Configure CDN for frontend
- Load testing 
- Database query optimization
- API rate limiting

### 9. Scaling Considerations

- Horizontal scaling with load balancer
- Database replication
- Read replicas for reporting
- Microservices architecture (future)

## Monitoring in Production

### Key Metrics
- API response time (target: <200ms)
- Threat detection latency (target: <1 min)
- Alert delivery time (target: <30s)
- System uptime (target: 99.9%)

### Alerts to Set
- Database connection failures
- High API latency
- Alert queue buildup
- Memory/CPU threshold exceeded
- Threat collection growth rate

## Incident Response

1. Alert triggered
2. Escalation to security team
3. Incident investigation
4. Remediation
5. Post-incident review

## Rollback Procedure

```bash
# Kubernetes rollback
kubectl rollout undo deployment/cyber-threat-backend

# Docker rollback
docker-compose down
docker-compose -f docker-compose.prod.yml up -d
```

## Cost Optimization

- Use spot instances for non-critical workloads
- Implement data retention policies
- Monitor API usage costs
- Right-size database instances
- Implement caching strategies

## SLA Requirements

- 99.9% uptime
- <1 minute detection latency
- <30 second alert delivery
- 24/7 monitoring and support
