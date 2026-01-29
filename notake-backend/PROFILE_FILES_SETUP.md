# Backend Setup - Profile & File Upload Features

## 🎉 What's Been Added

### Backend Components

#### 1. **New Models**
- `Profile.java` - User profile with image, bio, location, phone, website, date of birth
- `FileMetadata.java` - File tracking with auto-category detection (Document, Image, Video, Audio, Other)

#### 2. **Repositories**
- `ProfileRepository` - Profile CRUD operations
- `FileMetadataRepository` - File metadata operations with search and filtering

#### 3. **DTOs**
- `ProfileDTO` - Profile data with statistics (total notes, files, board links)
- `ProfileUpdateRequest` - Profile update request
- `FileUploadResponse` - File upload response with metadata

#### 4. **Services**
- `ProfileService` - Profile management and statistics
- `FileStorageService` - File storage with physical file handling

#### 5. **Controllers**
- `ProfileController` - REST endpoints for profile operations
- `FileController` - REST endpoints for file operations

### API Endpoints

#### Profile Endpoints
```
GET    /api/profile              - Get current user's profile (auto-creates if not exists)
PUT    /api/profile              - Update profile information
POST   /api/profile/upload-image - Upload profile image (max 5MB, images only)
```

#### File Endpoints
```
GET    /api/files                    - Get all user's files
POST   /api/files/upload             - Upload single file (max 50MB)
POST   /api/files/upload-multiple    - Upload multiple files
GET    /api/files/download/{id}      - Download file
GET    /api/files/profile/{filename} - Get profile image
DELETE /api/files/{id}               - Delete file
```

### Frontend Integration

#### New Services
- `profileService.ts` - Profile API calls
- `fileService.ts` - File upload/download API calls

#### Updated Pages
- `Profile.tsx` - Now fetches real profile data and uploads images to backend
- `Files.tsx` - Now uploads/downloads/deletes files from backend

### Configuration

Added to [application.properties](src/main/resources/application.properties):
```properties
# File Upload Configuration
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
file.upload-dir=uploads
```

### File Storage

Files are stored in the `uploads/` directory with subdirectories:
- `uploads/profile-images/` - Profile images
- `uploads/user-files/` - User uploaded files

## 🚀 Running the Application

### 1. Start PostgreSQL
```bash
# Start PostgreSQL service
sudo service postgresql start

# Verify it's running
sudo service postgresql status
```

### 2. Start Backend
```bash
cd notake-backend

# Clean and start
./mvnw clean spring-boot:run
```

The backend will:
- Connect to PostgreSQL
- Auto-create new tables: `profiles` and `file_metadata`
- Create the `uploads/` directory structure
- Start on port 8080

### 3. Start Frontend
```bash
cd notake-frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

Frontend runs on port 5173

## 📝 Testing the Features

### Profile Page
1. Login to the application
2. Navigate to Profile from sidebar
3. See your profile information and statistics
4. Click "Change Photo" to upload profile image
5. Image is uploaded to backend and displayed immediately

### Files Page
1. Navigate to Files from sidebar
2. Click "Upload Files" to select and upload files
3. Files are uploaded to backend with metadata
4. See file statistics (total, documents, images, videos)
5. Search and filter files by category
6. Switch between grid and list view
7. Download files by clicking download icon
8. Delete files (confirms before deletion)

## 🔒 Security

- All endpoints are protected with JWT authentication
- Profile images limited to 5MB
- Other files limited to 50MB
- File type validation for images
- User can only access their own files
- Physical files stored with UUID names to prevent conflicts

## 📊 Database Schema

### Profiles Table
```sql
id              BIGSERIAL PRIMARY KEY
user_id         BIGINT UNIQUE NOT NULL (FK to users)
profile_image_url VARCHAR
bio             VARCHAR(500)
location        VARCHAR(50)
phone           VARCHAR(20)
website         VARCHAR(100)
date_of_birth   TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### File_Metadata Table
```sql
id                BIGSERIAL PRIMARY KEY
user_id           BIGINT NOT NULL (FK to users)
file_name         VARCHAR NOT NULL (UUID-based)
original_file_name VARCHAR NOT NULL
file_type         VARCHAR NOT NULL
file_size         BIGINT NOT NULL
file_path         VARCHAR NOT NULL
category          VARCHAR NOT NULL (DOCUMENT, IMAGE, VIDEO, AUDIO, OTHER)
upload_date       TIMESTAMP
updated_at        TIMESTAMP
```

## ✅ Features Completed

✅ Profile management with auto-creation
✅ Profile image upload and display
✅ Profile statistics (notes, files, board links count)
✅ File upload (single and multiple)
✅ File download
✅ File deletion
✅ Auto-category detection
✅ File size formatting
✅ Search and filter files
✅ Grid/List view toggle
✅ Real-time statistics
✅ Error handling
✅ Loading states
✅ JWT authentication on all endpoints

---

**Status**: ✅ Ready to use  
**Version**: 2.0  
**Date**: January 29, 2026
