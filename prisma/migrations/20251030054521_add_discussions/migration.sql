-- CreateTable
CREATE TABLE "InternalDiscussion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "InternalDiscussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "DiscussionComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InternalDiscussion" ADD CONSTRAINT "InternalDiscussion_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionComment" ADD CONSTRAINT "DiscussionComment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "InternalDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionComment" ADD CONSTRAINT "DiscussionComment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
