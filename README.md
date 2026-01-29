<div align="center">
  <img src="notake-frontend/src/assets/notake-logo.svg" alt="NOTAKE Logo" width="200"/>
  
  # NOTAKE
  
  **A Modern, Full-Stack Note-Taking Application**
  
  ![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.2-brightgreen?style=flat-square&logo=spring)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql)
  ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)
  
  *Pursuing the goal of creating a powerful, secure, and beautiful note-taking experience*
  
</div>

---

## 📖 Project Overview

NOTAKE is a full-stack web application for creating, managing, and organizing notes. Built with modern technologies and best practices, it features a beautiful dark-themed UI, secure authentication, and seamless real-time data synchronization between frontend and backend.

### ✨ Current Features

✅ **User Authentication**
- Secure JWT-based authentication
- User registration with email validation
- Password encryption using BCrypt
- Token-based session management
- Auto-logout on token expiration

✅ **Note Management**
- Create, read, update, and delete notes
- Rich text content support
- Real-time search by title
- Timestamp tracking (created/updated)
- Responsive grid layout

✅ **Modern UI/UX**
- Beautiful dark gradient theme (Cyan & Purple accents)
- 3D card effects with smooth animations
- Fully responsive design (mobile-friendly)
- Loading states and error handling
- Modal-based note editing

✅ **Security & Performance**
- Protected routes and API endpoints
- CORS configuration
- Request/response interceptors
- Automatic error handling
- Database connection pooling

---

## 🎯 Project Status

### Phase 1: Foundation ✅ **COMPLETED**
- [x] Backend API with Spring Boot
- [x] PostgreSQL database setup
- [x] RESTful endpoints for notes CRUD
- [x] JPA/Hibernate ORM integration
- [x] Health check endpoints

### Phase 2: Authentication ✅ **COMPLETED**
- [x] JWT token generation and validation
- [x] User registration and login
- [x] Spring Security configuration
- [x] Password encryption
- [x] Token-based authorization

### Phase 3: Frontend Integration ✅ **COMPLETED**
- [x] React + TypeScript setup with Vite
- [x] Beautiful authentication page (Login/Register)
- [x] Dashboard with notes management
- [x] API service layer with Axios
- [x] Protected routing
- [x] State management
- [x] Error handling and validation

### Phase 4: DevOps 🚧 **IN PROGRESS**
- [x] Docker containerization
- [x] Docker Compose multi-container setup
- [x] Nginx configuration
- [x] GitHub Actions CI/CD
- [ ] Production deployment
- [ ] Monitoring and logging

### Phase 5: Enhancement 📋 **PLANNED**
- [ ] Note categories and tags
- [ ] Rich text editor (Markdown support)
- [ ] File attachments
- [ ] Note sharing and collaboration
- [ ] Export functionality (PDF, Markdown)
- [ ] User profile management
- [ ] Dark/Light theme toggle
- [ ] Real-time updates with WebSockets

---

## 🚀 Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.2
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7
- **Styling**: Custom CSS (Dark Theme)

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions
- **Version Control**: Git

---

## � Getting Started

### Prerequisites
- **Java 21** or higher
- **Node.js 20+** and npm
- **PostgreSQL 15+**
- **Docker & Docker Compose** (for containerized setup)
- **Git**

---

## 🐳 Quick Start with Docker (Recommended)

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

### Step 1: Database Setup

**Start PostgreSQL:**
```bash
# On WSL/Linux
sudo service postgresql start

# Verify it's running
sudo service postgresql status
```

**Create database and user:**
```bash
sudo -u postgres psql
```

Run these SQL commands:
```sql
CREATE USER notake_user WITH PASSWORD 'strongpassword';
CREATE DATABASE notake_db;
GRANT ALL PRIVILEGES ON DATABASE notake_db TO notake_user;
\c notake_db
GRANT ALL ON SCHEMA public TO notake_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO notake_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO notake_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO notake_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO notake_user;
\q
```

**Verify connection:**
```bash
psql -U notake_user -d notake_db -h localhost
# Password: strongpassword
```

---Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Notes Endpoints (Require Authentication)
- `GET /api/notes` - Get all notes
- `GET /api/notes/{id}` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note
- `GET /api/notes/search?keyword=x` - Search notes by title
- `GET /api/notes/count` - Get total notes count

### Health Check
- `GET /api/health` - Check API status

**📚 For detailed API documentation, see:** [notake-frontend/API_ENDPOINTS.md](notake-frontend/API_ENDPOINTS.md)
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

**Backend will start on:** http://localhost:8080

**Verify backend is running:**
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"OK"}
```

---

### Step 3: Frontend (React + Vite)

**Navigate to frontend directory:**
```bash
cd notake-frontend
```

**Configure API URL:**
Edit `.env` file:
```env
VITE_API_URL=http://localhost          # Spring Boot Backend
│   ├── src/main/java/com/example/notake_backend/
│   │   ├── config/                    # Security & CORS config
│   │   ├── controller/                # REST API controllers
│   │   │   ├── AuthController.java    # Authentication endpoints
│   │   │   ├── NoteController.java    # Notes CRUD endpoints
│   │   │   └── HealthCheckController.java
│   │   ├── dto/                       # Data Transfer Objects
│   │   ├── model/                     # JPA Entities (User, Note)
│   │   ├── repository/                # Spring Data JPA repositories
│   │   ├── security/                  # JWT utilities & filters
│   │   └── service/                   # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties     # Database & JWT config
│   ├── Dockerfile
│   └── pom.x & Verification

### Test Backend Health
```bash
curl http://localhost:8080/api/health
```

### Test User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Create a Note (requires token)
```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Note",
    "content": "This is a test note"
  }'
```

### Verify Data in Database
```bash
psql -U notake_user -d notake_db -h localhost
```
```sql
\dt                          -- List tables
SELECT * FROM users;         -- View users
SELECT * FROM notes;         -- View notes
```

---

## 📚 Documentation

- **[API_ENDPOINTS.md](notake-frontend/API_ENDPOINTS.md)** - Complete API reference with examples
- **[INTEGRATION.md](notake-frontend/INTEGRATION.md)** - Frontend-backend integration guide
- **[FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)** - Integration summary and status
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference for common tasks

---

## 🎨 Design Philosophy

NOTAKE features a modern, dark-themed interface inspired by contemporary design trends:

- **Color Palette**: 
  - Background: Dark gradients (#0f172a → #1e293b)
  - Accents: Cyan (#06b6d4) and Purple (#667eea)
  - Text: Light gray shades for optimal readability

- **UX Principles**:
  - Minimal friction: Quick login/register with smooth transitions
  - Visual feedback: Loading states, hover effects, animations
  - Responsive: Works seamlessly on desktop, tablet, and mobile
  - Accessible: Clear contrast, readable fonts, intuitive navigation

---

## 🔒 Security Features

- **Password Security**: BCrypt hashing with salt
- **JWT Authentication**: Secure token-based sessions
- **Protected Routes**: Frontend route guards
- **API Authorization**: Bearer token validation on all protected endpoints
- **CORS Configuration**: Controlled cross-origin requests
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **XSS Protection**: React's built-in escaping

---

## 🚀 Deployment

### Production Considerations

**Backend:**
- Update `application.properties` with production database credentials
- Set strong JWT secret key
- Configure CORS for production domain only
- Enable HTTPS
- Set up connection pooling
- Configure logging and monitoring

**Frontend:**
- Update `.env` with production API URL
- Build optimized production bundle: `npm run build`
- Deploy `dist` folder to static hosting (Netlify, Vercel, etc.)
- Configure environment-specific variables
- Enable HTTPS
- Set up CDN for assets

**Database:**
- Use managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
- Enable backups and point-in-time recovery
- Configure connection limits
- Set up monitoring and alerts
- Use strong passwords and connection encryption

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📋 Roadmap

### Next Steps
- [ ] User profile management and settings
- [ ] Note categories and tags system
- [ ] Rich text editor with Markdown support
- [ ] File attachments (images, PDFs)
- [ ] Note sharing and collaboration
- [ ] Export functionality (PDF, Markdown, JSON)
- [ ] Note templates
- [ ] Bulk operations (delete multiple, move to category)
- [ ] Advanced search (full-text, filters)
- [ ] Real-time collaboration with WebSockets
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- PostgreSQL community for the robust database
- All open-source contributors who made this possible

---

<div align="center">
  
  **Built with ❤️ by the NOTAKE Team**
  
  *Pursuing excellence in note-taking*
  
  ⭐ Star this repo if you find it useful!
  
</div>

### Step 4: Test the Application

1. **Open browser:** http://localhost:5173
2. **Register a new user:**
   - Switch to "Sign Up" tab
   - Enter: Full Name, Username, Email, Password
   - Click Submit
3. **You'll be auto-logged in and redirected to Dashboard**
4. **Create notes, edit, delete, and search!**

**Verify data in database:**
```bash
psql -U notake_user -d notake_db -h localhost
```
```sql
-- View registered users
SELECT id, username, email, full_name FROM users;

-- View created notes
SELECT id, title, LEFT(content, 50) as preview, created_at FROM notes;
```

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
