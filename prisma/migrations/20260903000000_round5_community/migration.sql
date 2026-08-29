-- AlterEnum
ALTER TYPE "RSVPStatus" ADD VALUE 'WAITLIST';

-- AlterTable
ALTER TABLE "CommunityComment" ADD COLUMN     "editedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CommunityGroup" ADD COLUMN     "inviteToken" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "CommunityGroup" ALTER COLUMN "inviteToken" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "mutedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityGroup_inviteToken_key" ON "CommunityGroup"("inviteToken");

