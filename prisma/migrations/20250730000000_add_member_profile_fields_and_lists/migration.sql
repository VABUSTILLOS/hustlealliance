-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
                 ADD COLUMN     "canHelpWith" TEXT[] DEFAULT ARRAY[]::TEXT[],
                 ADD COLUMN     "lookingFor" TEXT[] DEFAULT ARRAY[]::TEXT[],
                 ADD COLUMN     "businessInfo" TEXT,
                 ADD COLUMN     "hasOpportunities" BOOLEAN NOT NULL DEFAULT false,
                 ADD COLUMN     "marketplaceSeller" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MemberList" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberListItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "note" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberList_ownerId_idx" ON "MemberList"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberListItem_listId_memberId_key" ON "MemberListItem"("listId", "memberId");

-- CreateIndex
CREATE INDEX "MemberListItem_memberId_idx" ON "MemberListItem"("memberId");

-- AddForeignKey
ALTER TABLE "MemberList" ADD CONSTRAINT "MemberList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberListItem" ADD CONSTRAINT "MemberListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "MemberList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberListItem" ADD CONSTRAINT "MemberListItem_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
