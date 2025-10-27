-- Migration: drop User.executiveId (drop FK, index, and column)
-- This migration removes the legacy executiveId column which is no longer present in schema.prisma

BEGIN;

-- Drop foreign key constraint if it exists
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_executiveId_fkey";

-- Drop unique index on executiveId if exists
DROP INDEX IF EXISTS "User_executiveId_key";

-- Drop the column
ALTER TABLE "User" DROP COLUMN IF EXISTS "executiveId";

COMMIT;
