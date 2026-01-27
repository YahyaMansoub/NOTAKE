# Frontend Setup Guide

## 📦 Install Dependencies

Run the following command to install all required packages:

```bash
cd notake-frontend
npm install axios react-router-dom tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Or if using package.json directly:
```bash
npm install
```

## 🚀 Run the Frontend

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 🔐 Login Flow

1. **Start Backend**: Make sure your Spring Boot backend is running on `http://localhost:8080`
2. **Start Frontend**: Run `npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Login**: Use credentials from a registered user

## 📁 Project Structure

```
src/
├── pages/
│   ├── LoginPage.tsx       # Beautiful login page with Tailwind
│   └── Dashboard.tsx       # Post-login dashboard
├── services/
│   └── authService.ts      # JWT authentication service
├── App.tsx                 # Main app with auth routing
├── index.css               # Tailwind imports
└── main.tsx
```

## 🎨 Features

### Login Page
- ✅ Modern gradient design with Tailwind CSS
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ JWT token storage in localStorage
- ✅ Responsive design

### Auth Service
- ✅ Login functionality
- ✅ Register functionality (ready for signup page)
- ✅ Token management
- ✅ Automatic token storage
- ✅ User session management

### Dashboard
- ✅ Protected route (requires authentication)
- ✅ User info display
- ✅ Logout functionality
- ✅ Success message

## 🧪 Testing

1. **Test Backend Connection**:
```bash
curl http://localhost:8080/api/health/ping
```

2. **Register a User** (via terminal):
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

3. **Login via Frontend**:
   - Username: `testuser`
   - Password: `password123`

## 🔧 Configuration

API URL is set in `src/services/authService.ts`:
```typescript
const API_URL = 'http://localhost:8080/api';
```

Change this if your backend runs on a different port.

## 🎨 Tailwind Colors

Custom color palette defined in `tailwind.config.js`:
- Primary blue shades (50-900)
- Gradient effects
- Modern UI components

## 📝 Next Steps

- [ ] Add registration page
- [ ] Add password reset
- [ ] Add form validation improvements
- [ ] Add remember me functionality
- [ ] Connect to notes API
- [ ] Add loading skeletons
