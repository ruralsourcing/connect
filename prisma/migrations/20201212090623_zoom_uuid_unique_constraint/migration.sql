/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[uuid]` on the table `Meeting`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Meeting.uuid_unique" ON "Meeting"("uuid");
