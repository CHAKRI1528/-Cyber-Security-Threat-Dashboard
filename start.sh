#!/bin/bash
# Start monitoring services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
# docker-compose down

# Rebuild containers
# docker-compose build --no-cache
