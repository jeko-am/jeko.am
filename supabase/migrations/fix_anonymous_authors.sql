-- Fix "Anonymous" post authors to use email username instead
-- This migration updates all posts where author_name is "Anonymous"
-- to use the user's email username (part before @)

UPDATE posts
SET author_name = SUBSTRING(SPLIT_PART(u.email, '@', 1), 1, 50)
FROM auth.users u
WHERE posts.user_id = u.id
AND (posts.author_name = 'Anonymous' OR posts.author_name ILIKE 'anonymous%');

-- Log the update
SELECT 'Updated posts with anonymous authors to use email usernames' as status;
