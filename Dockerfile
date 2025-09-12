# Multi-stage build for production deployment
FROM node:18-alpine AS frontend-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production

COPY client/ ./
RUN npm run build

# Backend build stage
FROM openjdk:17-jdk-slim AS backend-build

WORKDIR /app/server
COPY server/mvnw server/pom.xml ./
COPY server/.mvn ./.mvn
RUN ./mvnw dependency:resolve

COPY server/src ./src
RUN ./mvnw clean package -DskipTests

# Production image
FROM openjdk:17-jre-slim

# Install nginx for serving frontend
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend JAR
COPY --from=backend-build /app/server/target/*.jar /app/sarangsalgi.jar

# Copy frontend build
COPY --from=frontend-build /app/client/dist /var/www/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Environment variables will be set via docker-compose or runtime

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose ports
EXPOSE 80 8080

# Start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]