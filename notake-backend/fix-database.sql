-- Add user_id column to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- Add foreign key constraint
ALTER TABLE notes 
ADD CONSTRAINT fk_notes_user 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE;

-- If you have existing notes without a user, you can either:
-- 1. Delete them:
-- DELETE FROM notes WHERE user_id IS NULL;

-- 2. Or assign them to a default user (replace 1 with an actual user id):
-- UPDATE notes SET user_id = 1 WHERE user_id IS NULL;
