-- Migration: Add ON DELETE CASCADE to foreign keys
-- Purpose: Ensure atomic deletion of roadmaps and all related data
-- Date: 2025-12-21
-- 
-- INSTRUCTIONS:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify by creating a test roadmap, then deleting it
-- 3. Confirm all child records are automatically deleted
--
-- ROLLBACK:
-- If needed, restore original constraints without CASCADE using:
-- ALTER TABLE phases DROP CONSTRAINT IF EXISTS phases_roadmap_id_fkey;
-- ALTER TABLE phases ADD CONSTRAINT phases_roadmap_id_fkey 
--   FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id);
-- (repeat for milestones and resources)

-- Step 1: Drop existing foreign key constraints
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_milestone_id_fkey;
ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_phase_id_fkey;
ALTER TABLE phases DROP CONSTRAINT IF EXISTS phases_roadmap_id_fkey;

-- Step 2: Re-add constraints with ON DELETE CASCADE
ALTER TABLE phases ADD CONSTRAINT phases_roadmap_id_fkey
  FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE;

ALTER TABLE milestones ADD CONSTRAINT milestones_phase_id_fkey
  FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE;

ALTER TABLE resources ADD CONSTRAINT resources_milestone_id_fkey
  FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE;

-- Step 3: Add index for performance on cascade operations
CREATE INDEX IF NOT EXISTS idx_phases_roadmap_id ON phases(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_milestones_phase_id ON milestones(phase_id);
CREATE INDEX IF NOT EXISTS idx_resources_milestone_id ON resources(milestone_id);

-- Verification queries (run after migration):
-- 
-- Check constraint definitions:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid IN ('phases'::regclass, 'milestones'::regclass, 'resources'::regclass)
-- AND contype = 'f';
