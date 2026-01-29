# NOTAKE API Endpoints Documentation

This document provides comprehensive documentation of all backend API endpoints and their integration with the frontend.

## Base Configuration

- **Base URL**: Configured via `.env` file as `VITE_API_URL`
- **Default**: `http://localhost:8080/api`
- **Authentication**: Bearer Token (JWT) sent in `Authorization` header
- **Content-Type**: `application/json`

## Authentication Endpoints

### 1. Register New User

**Endpoint**: `POST /api/auth/register`

**Description**: Creates a new user account and returns an authentication token.

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

**Success Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "role": "USER"
}
```

**Error Responses**:
- **400 Bad Request**: Username or email already exists
  ```json
  {
    "error": "Username already taken"
  }
  ```
  or
  ```json
  {
    "error": "Email already registered"
  }
  ```

**Frontend Integration**:
- Service: `authService.register()`
- File: `src/services/authService.ts`
- Page: `AuthPage.tsx` (Sign Up form)
- On success: Token stored in localStorage, redirect to `/dashboard`

---

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticates a user and returns an authentication token.

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "role": "USER"
}
```

**Error Response**:
- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "error": "Invalid username or password"
  }
  ```

**Frontend Integration**:
- Service: `authService.login()`
- File: `src/services/authService.ts`
- Page: `AuthPage.tsx` (Log In form)
- On success: Token stored in localStorage, redirect to `/dashboard`

---

### 3. Validate Token

**Endpoint**: `GET /api/auth/validate`

**Description**: Validates the current authentication token and returns user information.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "valid": true,
  "username": "string",
  "email": "string",
  "role": "USER"
}
```

**Error Response**:
- **401 Unauthorized**: Invalid or expired token
  ```json
  {
    "error": "Invalid token"
  }
  ```

**Frontend Integration**:
- Service: `authService.validateToken()`
- File: `src/services/authService.ts`
- Used by: API interceptor for automatic token validation
- On 401: Automatically clears localStorage and redirects to login

---

## Notes Endpoints

All notes endpoints require authentication via Bearer token in the Authorization header.

### 4. Get All Notes

**Endpoint**: `GET /api/notes`

**Description**: Retrieves all notes for the authenticated user.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Note Title",
    "content": "Note content here...",
    "createdAt": "2026-01-29T10:30:00",
    "updatedAt": "2026-01-29T15:45:00"
  },
  ...
]
```

**Frontend Integration**:
- Service: `noteService.getAllNotes()`
- File: `src/services/noteService.ts`
- Page: `Dashboard.tsx` (Notes grid)
- Called on: Component mount and after CRUD operations

---

### 5. Get Note by ID

**Endpoint**: `GET /api/notes/{id}`

**Description**: Retrieves a specific note by its ID.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id` (number): The ID of the note

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Note Title",
  "content": "Note content here...",
  "createdAt": "2026-01-29T10:30:00",
  "updatedAt": "2026-01-29T15:45:00"
}
```

**Error Response**:
- **404 Not Found**: Note doesn't exist

**Frontend Integration**:
- Service: `noteService.getNoteById(id)`
- File: `src/services/noteService.ts`
- Usage: Available but not currently used in UI (can be used for detailed view)

---

### 6. Create Note

**Endpoint**: `POST /api/notes`

**Description**: Creates a new note.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "string",
  "content": "string"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "title": "Note Title",
  "content": "Note content here...",
  "createdAt": "2026-01-29T10:30:00",
  "updatedAt": "2026-01-29T10:30:00"
}
```

**Error Response**:
- **500 Internal Server Error**: Server error during creation

**Frontend Integration**:
- Service: `noteService.createNote(note)`
- File: `src/services/noteService.ts`
- Page: `Dashboard.tsx` (Create modal)
- Triggered by: "New Note" button → Modal form submission

---

### 7. Update Note

**Endpoint**: `PUT /api/notes/{id}`

**Description**: Updates an existing note.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id` (number): The ID of the note to update

**Request Body**:
```json
{
  "title": "string",
  "content": "string"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "createdAt": "2026-01-29T10:30:00",
  "updatedAt": "2026-01-29T16:00:00"
}
```

**Error Response**:
- **404 Not Found**: Note doesn't exist

**Frontend Integration**:
- Service: `noteService.updateNote(id, note)`
- File: `src/services/noteService.ts`
- Page: `Dashboard.tsx` (Edit modal)
- Triggered by: Edit icon → Modal form submission

---

### 8. Delete Note

**Endpoint**: `DELETE /api/notes/{id}`

**Description**: Deletes a note.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id` (number): The ID of the note to delete

**Success Response** (200 OK):
```json
{
  "message": "Note deleted successfully"
}
```

**Error Response**:
- **404 Not Found**: Note doesn't exist

**Frontend Integration**:
- Service: `noteService.deleteNote(id)`
- File: `src/services/noteService.ts`
- Page: `Dashboard.tsx` (Note card)
- Triggered by: Delete icon → Confirmation → API call

---

### 9. Search Notes

**Endpoint**: `GET /api/notes/search?keyword={keyword}`

**Description**: Searches notes by title containing the keyword (case-insensitive).

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `keyword` (string): The search term

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Matching Note Title",
    "content": "Note content...",
    "createdAt": "2026-01-29T10:30:00",
    "updatedAt": "2026-01-29T15:45:00"
  },
  ...
]
```

**Frontend Integration**:
- Service: `noteService.searchNotes(keyword)`
- File: `src/services/noteService.ts`
- Page: `Dashboard.tsx` (Search box)
- Triggered by: Search button or Enter key in search input

---

### 10. Get Notes Count

**Endpoint**: `GET /api/notes/count`

**Description**: Returns the total number of notes.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "count": 42
}
```

**Frontend Integration**:
- Service: `noteService.getNotesCount()`
- File: `src/services/noteService.ts`
- Usage: Available but not currently displayed in UI (can be used for statistics)

---

## Health Check Endpoint

### 11. Health Check

**Endpoint**: `GET /api/health`

**Description**: Basic health check endpoint to verify the API is running.

**Success Response** (200 OK):
```json
{
  "status": "OK"
}
```

**Frontend Integration**:
- Not directly integrated in current UI
- Can be used for application monitoring

---

## Authentication Flow

### Initial Load
1. App checks `localStorage` for token
2. If token exists, user is redirected to `/dashboard`
3. If no token, user sees login/register page

### Login/Register
1. User submits form (AuthPage)
2. API request to `/auth/login` or `/auth/register`
3. On success:
   - Token stored in `localStorage` with key `token`
   - User data stored in `localStorage` with key `user`
   - Redirect to `/dashboard`
4. On error:
   - Error message displayed in form

### Protected Routes
1. Every API request includes token via axios interceptor
2. If 401 response received:
   - Token and user data cleared from localStorage
   - User redirected to login page

### Logout
1. User clicks logout button
2. `authService.logout()` called
3. Token and user data removed from localStorage
4. Redirect to login page

---

## Frontend Service Files

### 1. `src/services/api.ts`
- Base axios instance configuration
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 errors (automatic logout)

### 2. `src/services/authService.ts`
- `login()`: Authenticate user
- `register()`: Create new user account
- `logout()`: Clear authentication data
- `getCurrentUser()`: Get user from localStorage
- `getToken()`: Get token from localStorage
- `isAuthenticated()`: Check if user is logged in
- `validateToken()`: Validate current token

### 3. `src/services/noteService.ts`
- `getAllNotes()`: Fetch all notes
- `getNoteById(id)`: Fetch single note
- `createNote(note)`: Create new note
- `updateNote(id, note)`: Update existing note
- `deleteNote(id)`: Delete note
- `searchNotes(keyword)`: Search notes by title
- `getNotesCount()`: Get total notes count

---

## Error Handling

### API Errors
All API errors are caught and handled in the frontend:
- Network errors: Display generic error message
- 401 Unauthorized: Automatic logout and redirect
- 400 Bad Request: Display specific error from backend
- 404 Not Found: Display appropriate message
- 500 Server Error: Display generic error message

### Frontend Error Display
- Authentication errors: Displayed above the form
- Note operation errors: Displayed in error banner at top of dashboard
- Modal errors: Displayed within the modal

---

## Security Notes

1. **JWT Token Storage**: Token stored in localStorage (consider httpOnly cookies for production)
2. **CORS**: Backend configured with `@CrossOrigin(origins = "*")` - restrict in production
3. **Password Requirements**: Backend should enforce password complexity (currently not enforced)
4. **Token Expiration**: Ensure JWT tokens have reasonable expiration times
5. **HTTPS**: Always use HTTPS in production to protect token transmission

---

## Development vs Production

### Development
- API URL: Set in `.env` as `VITE_API_URL=http://172.28.159.226:8080/api`
- CORS: Allowed from all origins

### Production
- Update `VITE_API_URL` to production backend URL
- Restrict CORS to specific frontend domain
- Enable HTTPS
- Consider using httpOnly cookies instead of localStorage for tokens
- Implement rate limiting on backend
- Add input validation and sanitization

---

## Testing Endpoints

### Using cURL

**Login**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Get Notes**:
```bash
curl -X GET http://localhost:8080/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Note**:
```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content here"}'
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running
   - Check `VITE_API_URL` in `.env`
   - Verify CORS configuration in backend

2. **401 Unauthorized**
   - Token may have expired
   - Check token is correctly stored in localStorage
   - Verify Authorization header is being sent

3. **Network Errors**
   - Confirm backend is running on correct port
   - Check firewall settings
   - Verify API URL is correct

4. **404 Not Found**
   - Verify endpoint URL is correct
   - Check if resource exists in database
   - Ensure backend routes are properly configured

---

## Future Enhancements

Potential API improvements:
- User profile management endpoints
- Note sharing and collaboration
- Note categories/tags
- File attachments for notes
- Note version history
- Bulk operations (delete multiple notes)
- Advanced search (search in content, by date, etc.)
- Note export functionality (PDF, Markdown)
- Real-time updates using WebSockets
