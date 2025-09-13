#!/bin/sh
set -e

# Create log directory
mkdir -p /app/logs

# Choose nginx config based on SSL certificate existence
if [ -f "/etc/ssl/certs/cert.pem" ] && [ -f "/etc/ssl/private/key.pem" ]; then
    echo "SSL certificates found, using HTTPS configuration"
    # HTTPS config is already copied to /etc/nginx/http.d/default.conf
else
    echo "SSL certificates not found, using HTTP-only configuration"
    cp /etc/nginx/nginx-http-only.conf /etc/nginx/http.d/default.conf
fi

# Test nginx configuration
nginx -t

# Start nginx in background
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait for nginx to start
sleep 3

# Function to handle shutdown
cleanup() {
    echo "Shutting down..."
    kill $NGINX_PID 2>/dev/null || true
    exit 0
}
trap cleanup TERM INT

# Start Spring Boot application
echo "Starting Spring Boot application..."
java -jar /app/sarangsalgi.jar &
SPRING_PID=$!

# Wait for either process to exit
wait $SPRING_PID