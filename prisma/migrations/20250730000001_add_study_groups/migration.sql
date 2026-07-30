-- CreateTable
CREATE TABLE "CourseStudyGroup" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseStudyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroupPost" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseGroupPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroupReply" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseGroupReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroupFile" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseGroupFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseStudyGroup_courseId_key" ON "CourseStudyGroup"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseGroupMember_groupId_userId_key" ON "CourseGroupMember"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "CourseStudyGroup" ADD CONSTRAINT "CourseStudyGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupMember" ADD CONSTRAINT "CourseGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupMember" ADD CONSTRAINT "CourseGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupPost" ADD CONSTRAINT "CourseGroupPost_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupPost" ADD CONSTRAINT "CourseGroupPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupReply" ADD CONSTRAINT "CourseGroupReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CourseGroupPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupReply" ADD CONSTRAINT "CourseGroupReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupFile" ADD CONSTRAINT "CourseGroupFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseGroupFile" ADD CONSTRAINT "CourseGroupFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
