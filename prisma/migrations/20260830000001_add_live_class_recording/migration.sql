-- CreateTable
CREATE TABLE "LiveClassRecording" (
    "id" TEXT NOT NULL,
    "liveClassId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "durationSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveClassRecording_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveClassRecording_liveClassId_idx" ON "LiveClassRecording"("liveClassId");

-- AddForeignKey
ALTER TABLE "LiveClassRecording" ADD CONSTRAINT "LiveClassRecording_liveClassId_fkey" FOREIGN KEY ("liveClassId") REFERENCES "LiveClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

