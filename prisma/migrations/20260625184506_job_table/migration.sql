-- CreateEnum
CREATE TYPE "JobTaskStatus" AS ENUM ('NOT_YET', 'STARTED', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('NO', 'YES');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LINKEDIN', 'FACEBOOK', 'DISCORD', 'BDJOBS', 'OTHER');

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "email" TEXT,
    "response" "ResponseStatus" NOT NULL DEFAULT 'NO',
    "jobTaskStatus" "JobTaskStatus" NOT NULL DEFAULT 'NOT_YET',
    "platform" "Platform" NOT NULL DEFAULT 'LINKEDIN',
    "position" TEXT NOT NULL,
    "location" TEXT,
    "jobPostingUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_userId_idx" ON "job"("userId");

-- CreateIndex
CREATE INDEX "job_applicationDate_idx" ON "job"("applicationDate");

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
