-- CreateTable
CREATE TABLE "LandingPageVersion" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingPageVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandingPageVersion_pageId_createdAt_idx" ON "LandingPageVersion"("pageId", "createdAt");

-- AddForeignKey
ALTER TABLE "LandingPageVersion" ADD CONSTRAINT "LandingPageVersion_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "LandingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

