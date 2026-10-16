-- CreateEnum
CREATE TYPE "AuditLogLevel" AS ENUM ('INFO', 'SUCCESS', 'ERROR', 'WARNING');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "level" "AuditLogLevel" NOT NULL DEFAULT 'INFO',
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "userId" INTEGER,
    "userName" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_module_createdAt_idx" ON "AuditLog"("module", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_level_createdAt_idx" ON "AuditLog"("level", "createdAt");
