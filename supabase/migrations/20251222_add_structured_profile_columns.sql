-- Migration: Add structured profile columns
-- Date: 2025-12-21
-- Purpose: Replace fragile semantic string parsing with proper typed columns
--
-- SAFETY: All new columns are nullable for backward compatibility
-- ROLLBACK: Run the rollback section at the bottom to reverse

-- ============================================
-- ADD NEW STRUCTURED COLUMNS
-- ============================================

-- Goal information (extracted from goals array)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal_role text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal_timeline text;

-- Skills/Experience information (extracted from skills array)  
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_field text;

-- Learning preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_style text;

-- Add comments for documentation
COMMENT ON COLUMN profiles.goal_role IS 'Target career role, e.g., "ML Engineer", "Product Manager"';
COMMENT ON COLUMN profiles.goal_timeline IS 'Timeline for goal, e.g., "6 months", "1 year"';
COMMENT ON COLUMN profiles.experience_level IS 'Current experience level, e.g., "Beginner", "Intermediate"';
COMMENT ON COLUMN profiles.primary_field IS 'Primary field of interest, e.g., "Technology", "Healthcare"';
COMMENT ON COLUMN profiles.learning_style IS 'Preferred learning style, e.g., "visual", "hands-on"';

-- ============================================
-- DATA MIGRATION: Extract from semantic strings
-- ============================================

-- Extract goal_role from goals array (pattern: "Achieve goal: X within Y")
UPDATE profiles
SET goal_role = (
  SELECT 
    CASE 
      WHEN goal ILIKE 'achieve goal:%' THEN
        TRIM(REGEXP_REPLACE(
          SPLIT_PART(SUBSTRING(goal FROM POSITION(':' IN goal) + 1), 'within', 1),
          '^\s+|\s+$', '', 'g'
        ))
      ELSE NULL
    END
  FROM UNNEST(goals) AS goal
  WHERE goal ILIKE 'achieve goal:%'
  LIMIT 1
)
WHERE goal_role IS NULL AND goals IS NOT NULL;

-- Extract goal_timeline from goals array (pattern: "within X")
UPDATE profiles
SET goal_timeline = (
  SELECT 
    CASE 
      WHEN goal ILIKE '%within%' THEN
        TRIM(SPLIT_PART(goal, 'within', 2))
      ELSE NULL
    END
  FROM UNNEST(goals) AS goal
  WHERE goal ILIKE '%within%'
  LIMIT 1
)
WHERE goal_timeline IS NULL AND goals IS NOT NULL;

-- Extract experience_level from skills array (pattern: "Experience: X")
UPDATE profiles
SET experience_level = (
  SELECT 
    CASE 
      WHEN skill ILIKE 'experience:%' THEN
        TRIM(SUBSTRING(skill FROM POSITION(':' IN skill) + 1))
      ELSE NULL
    END
  FROM UNNEST(skills) AS skill
  WHERE skill ILIKE 'experience:%'
  LIMIT 1
)
WHERE experience_level IS NULL AND skills IS NOT NULL;

-- Extract primary_field from skills array (pattern: "Field: X")
UPDATE profiles
SET primary_field = (
  SELECT 
    CASE 
      WHEN skill ILIKE 'field:%' THEN
        TRIM(SUBSTRING(skill FROM POSITION(':' IN skill) + 1))
      ELSE NULL
    END
  FROM UNNEST(skills) AS skill
  WHERE skill ILIKE 'field:%'
  LIMIT 1
)
WHERE primary_field IS NULL AND skills IS NOT NULL;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check migration success rate
-- SELECT 
--   COUNT(*) as total_profiles,
--   COUNT(goal_role) as has_goal_role,
--   COUNT(goal_timeline) as has_goal_timeline,
--   COUNT(experience_level) as has_experience_level,
--   COUNT(primary_field) as has_primary_field
-- FROM profiles;

-- Sample migrated data
-- SELECT id, goal_role, goal_timeline, experience_level, primary_field, goals, skills
-- FROM profiles
-- LIMIT 10;

-- ============================================
-- ROLLBACK (if needed)
-- ============================================

-- ALTER TABLE profiles DROP COLUMN IF EXISTS goal_role;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS goal_timeline;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS experience_level;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS primary_field;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS learning_style;
