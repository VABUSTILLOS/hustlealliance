-- CreateEnum
CREATE TYPE "GroupKind" AS ENUM ('SPACE', 'GROUP');

-- AlterTable
ALTER TABLE "CommunityGroup" ADD COLUMN     "kind" "GroupKind" NOT NULL DEFAULT 'GROUP';

-- CreateIndex
CREATE INDEX "CommunityGroup_kind_idx" ON "CommunityGroup"("kind");

