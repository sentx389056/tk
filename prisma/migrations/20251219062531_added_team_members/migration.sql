-- CreateTable
CREATE TABLE "teamMembers" (
    "id" SERIAL NOT NULL,
    "orgName" TEXT NOT NULL,
    "contactsInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teamMembers_pkey" PRIMARY KEY ("id")
);
