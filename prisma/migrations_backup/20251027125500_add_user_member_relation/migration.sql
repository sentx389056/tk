-- Migration: add User.memberId foreign key to TechnicalCommitteeMember
BEGIN;

-- Add column (nullable) and unique index
ALTER TABLE "User" ADD COLUMN "memberId" INTEGER;
CREATE UNIQUE INDEX "User_memberId_key" ON "User"("memberId");

-- Add FK constraint
ALTER TABLE "User" ADD CONSTRAINT "User_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TechnicalCommitteeMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
