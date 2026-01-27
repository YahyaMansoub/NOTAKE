# JWT Authentication Testing Guide

## 🔐 Authentication Endpoints

### 1. Register New User
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

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "role": "USER"
}
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "role": "USER"
}
```

### 3. Validate Token
```bash
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "valid": true,
  "username": "testuser",
  "email": "test@example.com",
  "role": "USER"
}
```

## 📝 Using JWT Token with Notes API

After login/register, use the token to access protected endpoints:

### Create Note (Authenticated)
```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My Secure Note",
    "content": "This note requires authentication"
  }'
```

### Get All Notes (Authenticated)
```bash
curl -X GET http://localhost:8080/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update Note (Authenticated)
```bash
curl -X PUT http://localhost:8080/api/notes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Updated Secure Note",
    "content": "Updated content"
  }'
```

### Delete Note (Authenticated)
```bash
curl -X DELETE http://localhost:8080/api/notes/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔍 Testing Scenarios

### Test 1: Try accessing notes without token (should fail)
```bash
curl -X GET http://localhost:8080/api/notes
```
Expected: 403 Forbidden

### Test 2: Try with invalid token (should fail)
```bash
curl -X GET http://localhost:8080/api/notes \
  -H "Authorization: Bearer invalid_token_here"
```
Expected: 403 Forbidden

### Test 3: Register duplicate username (should fail)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "another@example.com",
    "password": "password123",
    "fullName": "Another User"
  }'
```
Expected: 400 Bad Request with error message

### Test 4: Login with wrong password (should fail)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "wrongpassword"
  }'
```
Expected: 401 Unauthorized

## 🗄️ Database Tables

The authentication system creates a `users` table:

```sql
-- View all users
SELECT * FROM users;

-- Check user roles
SELECT username, email, role, enabled, created_at FROM users;

-- Count users
SELECT COUNT(*) FROM users;
```

## 🔒 Security Features

- ✅ **Password Encryption**: Passwords hashed with BCrypt
- ✅ **JWT Tokens**: Stateless authentication
- ✅ **Token Expiration**: Tokens expire after 24 hours
- ✅ **Role-Based Access**: USER and ADMIN roles
- ✅ **Protected Endpoints**: All `/api/notes` endpoints require authentication
- ✅ **Public Endpoints**: `/api/auth/**` and `/api/health/**` are public

## 📊 Complete Testing Flow

```bash
# 1. Register a new user
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "secure123",
    "fullName": "John Doe"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Create a note with the token
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "First Authenticated Note",
    "content": "This is my secure note"
  }'

# 3. Get all notes
curl -X GET http://localhost:8080/api/notes \
  -H "Authorization: Bearer $TOKEN"

# 4. Validate token
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer $TOKEN"
```

## 🚨 Common Issues

### Issue: "Access Denied" / 403 Forbidden
- Make sure you include the `Authorization` header
- Check that the token format is: `Bearer YOUR_TOKEN`
- Verify the token hasn't expired (24 hours)

### Issue: Token not working
- Ensure jwt.secret in application.properties is set
- Restart the application after configuration changes

### Issue: Can't register user
- Check PostgreSQL is running
- Verify database credentials in application.properties
- Ensure users table was created (check logs)
