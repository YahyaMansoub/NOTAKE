# NOTAKE
Pursuing the goal of creating a powerful note app

## 🚀 Tech Stack

- **Backend**: Spring Boot 4.0.2 + Java 21 + PostgreSQL
- **Frontend**: React 19 + TypeScript + Vite
- **DevOps**: Docker + Docker Compose + Nginx + GitHub Actions

---

## 🐳 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Ports 80, 8080, and 5432 available

### Run the entire application:

```bash
docker-compose up -d
```

This will start:
- **Frontend** on http://localhost
- **Backend API** on http://localhost:8080
- **PostgreSQL** on localhost:5432

### Check status:
```bash
docker-compose ps
```

### View logs:
```bash
docker-compose logs -f
```

### Stop everything:
```bash
docker-compose down
```

### Stop and remove volumes (database data):
```bash
docker-compose down -v
```

---

## 🛠️ Manual Development Setup

### Backend (Spring Boot)

1. **Prerequisites**: Java 21, Maven, PostgreSQL

2. **Create database**:
```sql
CREATE DATABASE notake_db;
CREATE USER notake_user WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE notake_db TO notake_user;
```

3. **Run backend**:
```bash
cd notake-backend
./mvnw spring-boot:run
```

Backend runs on http://localhost:8080

### Frontend (React + Vite)

1. **Prerequisites**: Node.js 20+

2. **Install and run**:
```bash
cd notake-frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

---

## 📝 API Endpoints

### Health Check
- `GET /api/health/ping` - Check if app is running
- `GET /api/health/db` - Test database connection

### Notes CRUD
- `GET /api/notes` - Get all notes
- `GET /api/notes/{id}` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note
- `GET /api/notes/search?keyword=x` - Search notes
- `GET /api/notes/count` - Count total notes

---

## 🔧 Configuration

### Backend Configuration
Edit `notake-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notake_db
spring.datasource.username=notake_user
spring.datasource.password=strongpassword
```

### Frontend API URL
The Nginx configuration proxies `/api/*` requests to the backend automatically.

---

## 🔄 CI/CD

GitHub Actions automatically runs on push/PR to `main` or `develop`:
- ✅ Backend: Maven build, tests, Docker image
- ✅ Frontend: npm build, linting, Docker image

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

---

## 📂 Project Structure

```
NOTAKE/
├── notake-backend/          # Spring Boot backend
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── notake-frontend/         # React + TypeScript frontend
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml       # Multi-container setup
└── .github/workflows/       # CI/CD pipelines
```

---

## 🧪 Testing

### Test backend health:
```bash
curl http://localhost:8080/api/health/db
```

### Create a note:
```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Hello World"}'
```

### Get all notes:
```bash
curl http://localhost:8080/api/notes
```

---

## 📋 TODO
- [ ] Add authentication (JWT)
- [ ] Implement note categories/tags
- [ ] Add rich text editor
- [ ] Dark mode support
- [ ] Export notes (PDF, Markdown)

---

## 📄 License
MIT
