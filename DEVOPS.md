# Notake DevOps Cheat Sheet

## 🚀 Quick Commands

### Full Stack (Production Mode)
```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Development Mode (Database Only)
```bash
# Start only PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Then run backend and frontend manually
cd notake-backend && ./mvnw spring-boot:run
cd notake-frontend && npm run dev
```

### Individual Services
```bash
# Build backend image
docker build -t notake-backend ./notake-backend

# Build frontend image
docker build -t notake-frontend ./notake-frontend

# Run backend container
docker run -p 8080:8080 --env-file .env notake-backend

# Run frontend container
docker run -p 80:80 notake-frontend
```

## 🔍 Troubleshooting

### Check container status
```bash
docker-compose ps
```

### View specific service logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Access PostgreSQL
```bash
docker exec -it notake-postgres psql -U notake_user -d notake_db
```

### Restart a specific service
```bash
docker-compose restart backend
```

### Remove all containers and volumes
```bash
docker-compose down -v
docker system prune -a
```

## 🧪 Testing Endpoints

### Health checks
```bash
# App health
curl http://localhost:8080/api/health/ping

# Database health
curl http://localhost:8080/api/health/db
```

### CRUD operations
```bash
# Create note
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker Test","content":"Testing from container"}'

# Get all notes
curl http://localhost:8080/api/notes

# Get specific note
curl http://localhost:8080/api/notes/1

# Update note
curl -X PUT http://localhost:8080/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","content":"Modified content"}'

# Delete note
curl -X DELETE http://localhost:8080/api/notes/1
```

## 📦 What Each File Does

- **Dockerfile (backend)**: Multi-stage build for Spring Boot app
- **Dockerfile (frontend)**: Builds React app + serves with Nginx
- **docker-compose.yml**: Full production stack (frontend + backend + db)
- **docker-compose.dev.yml**: Database only for local development
- **nginx.conf**: Reverse proxy config (routes /api to backend)
- **.dockerignore**: Excludes unnecessary files from Docker build
- **ci.yml**: GitHub Actions pipeline for automated testing

## 🔐 Environment Variables

For production, create `.env` file:
```env
POSTGRES_DB=notake_db
POSTGRES_USER=notake_user
POSTGRES_PASSWORD=your_secure_password
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/notake_db
```

Then use:
```bash
docker-compose --env-file .env up -d
```
