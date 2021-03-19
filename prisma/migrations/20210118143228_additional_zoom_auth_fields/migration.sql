-- AlterTable
ALTER TABLE "ZoomAuth" ADD COLUMN     "refresh" TEXT,
ADD COLUMN     "expiration" INTEGER,
ADD COLUMN     "modified" TIMESTAMP(3);
