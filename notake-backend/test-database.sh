#!/bin/bash

# Database Test Script for NOTAKE
# This script tests if all features are working correctly

echo "======================================"
echo "NOTAKE Database Testing Script"
echo "======================================"
echo ""

DB_USER="notake_user"
DB_NAME="notake_db"
DB_PASS="strongpassword"
DB_HOST="localhost"

# Function to run SQL query
run_query() {
    PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -h $DB_HOST -t -c "$1"
}

echo "1. Testing User Accounts..."
echo "-----------------------------------"
run_query "SELECT COUNT(*) || ' users registered' FROM users;"
run_query "SELECT 'User: ' || username || ' (ID: ' || id || ')' FROM users ORDER BY created_at;"
echo ""

echo "2. Testing Profiles..."
echo "-----------------------------------"
run_query "SELECT COUNT(*) || ' profiles created' FROM profiles;"
run_query "SELECT 'Profile for user ID ' || user_id || ': Image=' || COALESCE(profile_image_url, 'NULL') || ', Bio=' || COALESCE(LEFT(bio, 30), 'NULL') FROM profiles;"
echo ""

echo "3. Testing Notes..."
echo "-----------------------------------"
run_query "SELECT COUNT(*) || ' notes total' FROM notes;"
run_query "SELECT 'Note #' || n.id || ': \"' || LEFT(n.title, 40) || '\" by user ' || u.username || ' (user_id=' || n.user_id || ')' FROM notes n JOIN users u ON n.user_id = u.id ORDER BY n.created_at DESC LIMIT 5;"
echo ""

echo "4. Testing File Uploads..."
echo "-----------------------------------"
run_query "SELECT COUNT(*) || ' files uploaded' FROM file_metadata;"
run_query "SELECT 'File #' || id || ': ' || original_file_name || ' (' || ROUND(file_size/1024.0, 2) || ' KB) - Category: ' || category FROM file_metadata ORDER BY upload_date DESC LIMIT 5;"
echo ""

echo "5. Checking Upload Directory..."
echo "-----------------------------------"
if [ -d "uploads/profile-images" ]; then
    echo "Profile images directory exists"
    echo "Files: $(ls -1 uploads/profile-images 2>/dev/null | wc -l) profile images"
    ls -lh uploads/profile-images/ 2>/dev/null | tail -n +2 | awk '{print "  - " $9 " (" $5 ")"}'
else
    echo "❌ Profile images directory NOT FOUND"
fi

echo ""
if [ -d "uploads/user-files" ]; then
    echo "User files directory exists"
    echo "Files: $(ls -1 uploads/user-files 2>/dev/null | wc -l) user files"
    ls -lh uploads/user-files/ 2>/dev/null | tail -n +2 | awk '{print "  - " $9 " (" $5 ")"}'
else
    echo "❌ User files directory NOT FOUND"
fi

echo ""
echo "6. Testing Data Integrity..."
echo "-----------------------------------"
run_query "SELECT CASE WHEN COUNT(*) = 0 THEN '✓ All notes have valid users' ELSE '❌ ' || COUNT(*) || ' notes with invalid users!' END FROM notes WHERE user_id NOT IN (SELECT id FROM users);"
run_query "SELECT CASE WHEN COUNT(*) = 0 THEN '✓ All profiles have valid users' ELSE '❌ ' || COUNT(*) || ' profiles with invalid users!' END FROM profiles WHERE user_id NOT IN (SELECT id FROM users);"
run_query "SELECT CASE WHEN COUNT(*) = 0 THEN '✓ All files have valid users' ELSE '❌ ' || COUNT(*) || ' files with invalid users!' END FROM file_metadata WHERE user_id NOT IN (SELECT id FROM users);"

echo ""
echo "======================================"
echo "Testing Complete!"
echo "======================================"
