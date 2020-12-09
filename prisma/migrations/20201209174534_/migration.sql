/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[userId]` on the table `ZoomAuth`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ZoomAuth_userId_unique" ON "ZoomAuth"("userId");
