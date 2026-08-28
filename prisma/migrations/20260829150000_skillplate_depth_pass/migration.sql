-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailUnsubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "trialDays" INTEGER;

-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "abandonedEmailSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "LandingPage" ADD COLUMN     "theme" JSONB;

-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN     "abTestSize" INTEGER,
ADD COLUMN     "variantSubjectB" TEXT;

-- AlterTable
ALTER TABLE "AutomationRun" ADD COLUMN     "currentStep" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "EmailAutomationStep" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EmailAutomationStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailAutomationStep_automationId_order_key" ON "EmailAutomationStep"("automationId", "order");

-- AddForeignKey
ALTER TABLE "EmailAutomationStep" ADD CONSTRAINT "EmailAutomationStep_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "EmailAutomation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
