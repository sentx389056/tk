/*
  Warnings:

  - You are about to drop the column `agenda` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `attachments` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Meeting` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."Meeting_date_idx";

-- DropIndex
DROP INDEX "public"."Meeting_organization_idx";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "agenda",
DROP COLUMN "date",
DROP COLUMN "organization",
DROP COLUMN "status",
ADD COLUMN     "attachments" TEXT NOT NULL,
ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "location" SET NOT NULL;
