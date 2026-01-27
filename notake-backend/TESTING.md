# Notake Backend - Testing Guide

## Prerequisites
1. **PostgreSQL** must be installed and running
2. **Java 21** must be installed
3. **Maven** should be available

## Step 1: Create the Database

Open PostgreSQL terminal or pgAdmin and run:

```sql
CREATE DATABASE notake_db;
```

## Step 2: Update Database Credentials

Edit `src/main/resources/application.properties` if your PostgreSQL credentials differ:

```properties
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

## Step 3: Run the Application

From the `notake-backend` directory:

```bash
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

## Step 4: Test the Endpoints

### 1. Test Application Health
```bash
curl http://localhost:8080/api/health/ping
```

Expected response:
```json
{
  "status": "UP",
  "message": "Application is running"
}
```

### 2. Test Database Connection
```bash
curl http://localhost:8080/api/health/db
```

Expected response:
```json
{
  "status": "SUCCESS",
  "message": "Database connection is healthy",
  "database": "PostgreSQL",
  "version": "...",
  "url": "jdbc:postgresql://localhost:5432/notake_db"
}
```

### 3. Create a Note
```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Note","content":"This is a test note"}'
```

### 4. Get All Notes
```bash
curl http://localhost:8080/api/notes
```

### 5. Get a Specific Note (replace {id} with actual ID)
```bash
curl http://localhost:8080/api/notes/1
```

### 6. Update a Note
```bash
curl -X PUT http://localhost:8080/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Note","content":"Updated content"}'
```

### 7. Search Notes
```bash
curl http://localhost:8080/api/notes/search?keyword=first
```

### 8. Count Notes
```bash
curl http://localhost:8080/api/notes/count
```

### 9. Delete a Note
```bash
curl -X DELETE http://localhost:8080/api/notes/1
```

## Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running: `sudo service postgresql status`
- Check database exists: `psql -U postgres -l`
- Verify credentials in application.properties

### Port Already in Use
- Change port in application.properties: `server.port=8081`
- Or stop the process using port 8080

### Application Won't Start
- Check Java version: `java -version` (should be 21)
- Clean and rebuild: `./mvnw clean install`

## What Was Created

1. **Database Configuration** - application.properties
2. **Entity Model** - Note.java (represents notes table)
3. **Repository Layer** - NoteRepository.java (database operations)
4. **Health Check API** - HealthCheckController.java (test DB connection)
5. **CRUD API** - NoteController.java (full note management)

## Database Table Created

When you first run the app, Hibernate will automatically create this table:

```sql
notes (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
)
```
