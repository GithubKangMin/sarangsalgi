# Multi-stage build for production deployment
FROM node:18-alpine AS frontend-build

WORKDIR /app/client
COPY client/package*.json ./

# Clear npm cache and reinstall with platform-specific dependencies
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install

COPY client/ ./
RUN npm run build

# Backend build stage
FROM --platform=linux/amd64 eclipse-temurin:17-jdk-alpine AS backend-build

WORKDIR /app/server
COPY server/mvnw server/pom.xml ./
COPY server/.mvn ./.mvn
RUN ./mvnw dependency:resolve

COPY server/src ./src
RUN ./mvnw clean package -DskipTests

# Production image
FROM --platform=linux/amd64 eclipse-temurin:17-jre-alpine

# Install nginx and curl for serving frontend and health checks
RUN apk update && apk add --no-cache nginx curl && mkdir -p /etc/nginx/sites-enabled

# Copy backend JAR
COPY --from=backend-build /app/server/target/*.jar /app/sarangsalgi.jar

# Copy frontend build
COPY --from=frontend-build /app/client/dist /var/www/html

# Copy nginx configurations
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/nginx-http-only.conf /etc/nginx/nginx-http-only.conf

# Environment variables will be set via docker-compose or runtime

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose ports
EXPOSE 80 443 8080

# Start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]