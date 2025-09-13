# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

사랑살기 (SarangSalgi) is a student participation platform for sharing concerns. It features a Spring Boot backend with React TypeScript frontend, designed for university student-admin interaction around concerns and discussion topics.

## Development Commands

### Frontend (client/)
- **Development server**: `npm run dev` (Vite dev server on localhost:5173)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Test**: `npm test` (Vitest)
- **Preview**: `npm preview` (Preview production build)

### Backend (server/)
- **Development**: `./mvnw spring-boot:run` (H2 database)
- **Production mode**: `SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run` (PostgreSQL)
- **Test**: `./mvnw test`
- **Build**: `./mvnw clean package`
- **Build without tests**: `./mvnw clean package -DskipTests`

### Database
- **Development**: H2 file database (automatic setup)
- **Local PostgreSQL**: `docker-compose up -d` (starts PostgreSQL container)

### Deployment
- **Production build**: `docker-compose -f docker-compose.prod.yml build`
- **Production deploy**: `./deploy.sh` or `docker-compose -f docker-compose.prod.yml up -d`

## Architecture

### Backend Structure (Spring Boot)
- **Package**: `com.sarangsalgi`
- **Entities**: Concern, Topic, Answer, ConcernCategory (JPA/Hibernate)
- **Controllers**: REST API endpoints with OpenAPI documentation
- **Services**: Business logic layer
- **Repositories**: JPA repositories for data access
- **Security**: Session-based admin authentication with Spring Security
- **Validation**: Bean validation with custom constraints

### Frontend Structure (React + TypeScript)
- **Components**: Modular React components in `/src/components/`
- **API Layer**: Centralized HTTP client in `/src/api/`
- **Types**: TypeScript interfaces in `/src/types/`
- **Styling**: Tailwind CSS
- **Build**: Vite bundler

### Key Domain Concepts
- **고민거울 (Concern Mirror)**: Students submit concerns (admin-only access)
- **고민해우 (Concern Resolution)**: Admin creates topics, students provide answers
- **Admin Panel**: Concern management, topic CRUD, answer monitoring

## Database Profiles
- **Default/dev**: H2 file database (`server/data/sarangsalgi.mv.db`)
- **prod**: PostgreSQL (requires environment setup)
- **docker**: PostgreSQL container setup

## API Documentation
- **Swagger UI**: http://localhost:8080/swagger-ui.html (when backend running)
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Key Environment Variables
- `ADMIN_PASSWORD`: Admin authentication (default: admin123)
- `SPRING_PROFILES_ACTIVE`: Database profile (dev/prod/docker)
- PostgreSQL connection vars for production (see `.env.example`)

## Docker Architecture
- **Multi-stage build**: Node.js frontend build + OpenJDK backend build
- **Production image**: nginx + Spring Boot JAR
- **Platform**: Uses `--platform=linux/amd64` for ARM Mac compatibility

## Validation Rules
- Student ID: 8-10 digits (`^\d{8,10}$`)
- Field length limits: Name (20), Title (100), Content (2000)
- Categories: 학업, 진로, 인간관계, 생활/재정, 건강/멘탈, 기타

## Security Features
- HttpOnly session cookies for admin auth
- CORS configuration for frontend domain
- Input sanitization and XSS prevention
- Validation on all user inputs

## Development Workflow
1. Start database: `docker-compose up -d` (if using PostgreSQL)
2. Start backend: `cd server && ./mvnw spring-boot:run`
3. Start frontend: `cd client && npm run dev`
4. Access: Frontend on :5173, Backend on :8080, Swagger on :8080/swagger-ui.html

## Testing
- Backend: JUnit/Spring Boot Test with `./mvnw test`
- Frontend: Vitest with `npm test`
- Integration: Use Swagger UI or curl for API testing (see `sample-curls.md`)