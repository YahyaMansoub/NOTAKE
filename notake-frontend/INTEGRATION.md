# Frontend-Backend Integration Guide

## Overview

The NOTAKE frontend has been successfully integrated with the backend API. This document provides a quick overview of the changes and how to use the application.

## What Was Added

### 1. Service Layer (`src/services/`)
- **api.ts**: Base Axios configuration with request/response interceptors
- **authService.ts**: Authentication operations (login, register, logout)
- **noteService.ts**: Note CRUD operations

### 2. Updated Components
- **AuthPage.tsx**: 
  - Connected login form to backend
  - Connected registration form to backend
  - Added form state management
  - Added error handling
  - Added username field to login (backend uses username, not email)

### 3. New Dashboard Page
- **Dashboard.tsx**: Full-featured notes management interface
  - View all notes in a grid layout
  - Create new notes via modal
  - Edit existing notes
  - Delete notes with confirmation
  - Search notes by title
  - Logout functionality
  - Same styling as AuthPage for consistency

### 4. Routing
- **App.tsx**: 
  - Added React Router
  - Protected routes for dashboard
  - Public routes for auth page
  - Automatic redirects based on authentication status

### 5. Documentation
- **API_ENDPOINTS.md**: Comprehensive API documentation

## Getting Started

### Prerequisites
- Node.js and npm installed
- Backend server running on the configured API URL

### Installation

```bash
cd notake-frontend
npm install
```

### Configuration

Update `.env` file with your backend URL:
```env
VITE_API_URL=http://your-backend-url:8080/api
```

Current value: `http://172.28.159.226:8080/api`

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

### Authentication
1. **Register**: Create a new account with username, email, password, and full name
2. **Login**: Sign in using username and password
3. **Auto-redirect**: Logged-in users are automatically redirected to dashboard
4. **Protected Routes**: Dashboard is only accessible when authenticated

### Dashboard
1. **View Notes**: All notes displayed in a responsive grid
2. **Create Note**: Click "New Note" button to open creation modal
3. **Edit Note**: Click edit icon on any note card
4. **Delete Note**: Click delete icon with confirmation prompt
5. **Search**: Search notes by title using the search bar
6. **Logout**: Click logout button to sign out

## Styling

The dashboard maintains the same visual style as the authentication page:
- Dark gradient background (#0f172a to #1e293b)
- Cyan and purple accents (#06b6d4, #667eea)
- 3D card effects with shadows
- Smooth transitions and hover effects
- Responsive design for mobile devices

## API Integration Details

### Authentication Flow
1. User logs in or registers
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically included in all subsequent requests
5. On 401 error, user is logged out and redirected to login

### Token Storage
- **Token**: Stored in `localStorage` with key `token`
- **User Data**: Stored in `localStorage` with key `user`

### Error Handling
- Network errors are caught and displayed to user
- 401 errors trigger automatic logout
- Form validation errors shown inline
- API errors displayed in user-friendly messages

## File Structure

```
src/
├── services/
│   ├── api.ts              # Base API configuration
│   ├── authService.ts      # Authentication service
│   └── noteService.ts      # Notes service
├── pages/
│   ├── AuthPage.tsx        # Login/Register page
│   ├── AuthPage.css        # Auth page styles
│   ├── Dashboard.tsx       # Dashboard page
│   └── Dashboard.css       # Dashboard styles
├── App.tsx                 # Main app with routing
└── main.tsx               # Entry point
```

## Backend Requirements

The frontend expects the following backend endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Token validation
- `GET /api/notes` - Get all notes
- `GET /api/notes/{id}` - Get note by ID
- `POST /api/notes` - Create note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note
- `GET /api/notes/search?keyword={keyword}` - Search notes
- `GET /api/notes/count` - Get notes count

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for detailed documentation.

## Important Notes

### Login Credential Format
⚠️ **Important**: The login form uses **username**, not email. This matches the backend's authentication requirement.

- ✅ Correct: Login with username
- ❌ Incorrect: Login with email

The registration form collects both email and username, but login requires the username.

### CORS Configuration
Ensure your backend has CORS properly configured to accept requests from your frontend origin.

### Token Expiration
If you experience unexpected logouts, check the JWT token expiration time in your backend configuration.

## Development Tips

### Hot Reload
The Vite dev server supports hot module replacement. Changes to React components will be reflected immediately.

### TypeScript
All service files use TypeScript for type safety. Interfaces are defined for all API requests and responses.

### Debugging
- Check browser console for error messages
- Check Network tab to inspect API requests/responses
- Token can be viewed in Application > Local Storage in DevTools

## Production Deployment

Before deploying to production:
1. Update `VITE_API_URL` to production backend URL
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service
4. Ensure backend CORS is configured for production domain
5. Use HTTPS for secure token transmission

## Troubleshooting

### "Network Error" or CORS issues
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Ensure backend CORS allows your frontend origin

### Automatic Logout
- Check JWT token expiration time
- Verify backend `/auth/validate` endpoint
- Check browser console for 401 errors

### Notes Not Loading
- Verify you're logged in (check localStorage for token)
- Check Network tab for API response
- Ensure backend database is properly configured

## Next Steps

Potential enhancements:
- Add note categories/tags
- Implement rich text editor
- Add note sharing functionality
- Add user profile management
- Implement real-time updates
- Add note export (PDF, Markdown)
- Add dark/light theme toggle
- Add note archiving

## Support

For issues or questions:
1. Check the [API_ENDPOINTS.md](./API_ENDPOINTS.md) documentation
2. Review browser console and network tab
3. Verify backend is running and accessible
4. Check backend logs for errors
