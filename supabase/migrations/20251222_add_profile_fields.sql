-- Migration: Add additional profile fields for enhanced profile page
-- Created: 2025-12-21

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN profiles.bio IS 'Short user bio/tagline';
COMMENT ON COLUMN profiles.display_name IS 'Display name (defaults to first_name if not set)';
COMMENT ON COLUMN profiles.learning_streak IS 'Current consecutive days of learning activity';
COMMENT ON COLUMN profiles.last_activity_date IS 'Date of last learning activity for streak calculation';
COMMENT ON COLUMN profiles.theme_preference IS 'UI theme preference: light, dark, or system';
COMMENT ON COLUMN profiles.email_notifications IS 'Whether user wants email notifications';
