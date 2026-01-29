#!/bin/bash

# Quick Database Verification for NOTAKE
echo "🔍 NOTAKE Quick Test"
echo "===================="

cd "$(dirname "$0")"

# Database connection function
query() {
    PGPASSWORD=strongpassword psql -U notake_user -d notake_db -h localhost -t -A -c "$1"
}

echo ""
echo "📊 Statistics:"
query "SELECT COUNT(*) || ' users' FROM users;"
query "SELECT COUNT(*) || ' profiles' FROM profiles;"
query "SELECT COUNT(*) || ' notes' FROM notes;"
query "SELECT COUNT(*) || ' files' FROM file_metadata;"

echo ""
echo "🖼️  Profile Images:"
query "SELECT u.username || ': ' || CASE WHEN p.profile_image_url IS NULL THEN 'NO IMAGE' ELSE 'HAS IMAGE' END FROM users u LEFT JOIN profiles p ON u.id = p.user_id;"

echo ""
echo "📁 Uploaded Files:"
if [ -d "uploads/profile-images" ]; then
    echo "  Profile images: $(ls -1 uploads/profile-images 2>/dev/null | wc -l) files"
fi
if [ -d "uploads/user-files" ]; then
    echo "  User files: $(ls -1 uploads/user-files 2>/dev/null | wc -l) files"
fi

echo ""
echo "✓ Test complete"
