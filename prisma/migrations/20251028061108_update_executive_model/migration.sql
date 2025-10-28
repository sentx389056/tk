/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Executive` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Executive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Executive` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Executive" ADD COLUMN     "address" TEXT,
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Executive_email_key" ON "Executive"("email");
