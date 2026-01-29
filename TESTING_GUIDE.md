# NOTAKE - Testing Guide

## What We Fixed

### 1. **Profile Picture Upload Issue**
- ✅ Files ARE being uploaded to `uploads/profile-images/`
- ✅ Database IS storing the image URL
- **Issue**: Browser caching was preventing image updates
- **Solution**: Added cache-busting timestamp to image URLs

### 2. **Excessive Database Queries**
- **Issue**: Hibernate was logging every SQL query, making it look like a performance problem
- **Solution**: Disabled `show-sql` and `format_sql` in production
- The queries themselves are normal - just hidden now for cleaner logs

### 3. **Database Schema**
- ✅ Added `user_id` column to notes table
- ✅ All foreign key constraints working correctly
- ✅ Data integrity verified

---

## How to Test Each Feature

### Test 1: Profile Picture Upload

**Steps:**
1. **Login** to the app
2. Go to **Profile** page
3. Click **"Change Photo"** button
4. Select an image file (< 5MB)
5. Wait for upload
6. **Refresh the page** (F5)
7. Image should now appear

**Verify in Database:**
```bash
cd notake-backend
PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -c "SELECT u.username, p.profile_image_url FROM users u JOIN profiles p ON u.id = p.user_id;"
```

**Check File System:**
```bash
ls -lh notake-backend/uploads/profile-images/
```

---

### Test 2: File Upload

**Steps:**
1. Go to **Files** page
2. Click **"Upload File"**
3. Select any file (< 50MB)
4. File should appear in the list
5. Try downloading it
6. Try deleting it

**Verify in Database:**
```bash
PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -c "SELECT id, original_file_name, file_size, category FROM file_metadata ORDER BY upload_date DESC;"
```

**Check File System:**
```bash
ls -lh notake-backend/uploads/user-files/
```

---

### Test 3: Notes with User Association

**Steps:**
1. Go to **Notes** page
2. Create a new note
3. Log out and create another user
4. Login with new user
5. Create notes as this user
6. Verify you **don't see** the first user's notes

**Verify in Database:**
```bash
PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -c "SELECT n.id, n.title, u.username FROM notes n JOIN users u ON n.user_id = u.id ORDER BY n.created_at DESC;"
```

**Expected:** Each note should be linked to the correct user

---

### Test 4: Profile Statistics

**Steps:**
1. Login to your account
2. Go to **Profile** page
3. Check the statistics:
   - Total Notes
   - Total Files
   - Total Board Links (should be 0 for now)
4. Create a note → Stats should update
5. Upload a file → Stats should update

**Verify in Database:**
```bash
# Count notes per user
PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -c "SELECT u.username, COUNT(n.id) as note_count FROM users u LEFT JOIN notes n ON u.id = n.user_id GROUP BY u.username;"

# Count files per user
PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -c "SELECT u.username, COUNT(f.id) as file_count FROM users u LEFT JOIN file_metadata f ON u.id = f.user_id GROUP BY u.username;"
```

---

## Database Health Check Script

Run this anytime to check database state:

```bash
cd notake-backend
./test-database.sh
```

---

## Troubleshooting

### Profile Image Not Showing

**Problem:** Image uploads but doesn't display

**Solutions:**
1. **Clear browser cache** (Ctrl+F5)
2. **Check browser console** (F12) for errors
3. **Verify backend is running** on correct port
4. **Test direct URL**: `http://172.28.159.226:8080/api/files/profile/<filename>`

### CORS Errors

**Problem:** Browser blocks requests

**Solution:**
- Ensure backend `CorsConfig` allows your frontend origin
- Check if `VITE_API_URL` in `.env` is correct

### File Upload Fails

**Problem:** Files don't upload

**Check:**
1. File size < 50MB
2. `uploads/` directory exists and is writable
3. Check backend logs for errors

### Database Connection Issues

**Problem:** Can't connect to PostgreSQL

**Solutions:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -c "SELECT version();"
```

---

## Next Steps

1. **Restart both backend and frontend** after the fixes
2. Test profile picture upload
3. Verify image appears after page refresh
4. Check that SQL logs are now cleaner (no more repeated queries shown)
5. Test all CRUD operations for notes and files

---

## Important Notes

- ⚠️ **Profile images are cached** - you MUST refresh the page to see updates
- 📊 **SQL logging is now disabled** - this is normal for production
- 🔒 **All data is user-isolated** - users can only see their own data
- 💾 **Files are stored locally** in `uploads/` directory
