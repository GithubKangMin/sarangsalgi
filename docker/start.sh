#!/bin/bash

# Start nginx in background
nginx -g "daemon off;" &

# Wait for nginx to start
sleep 2

# Start Spring Boot application
exec java -jar /app/sarangsalgi.jar