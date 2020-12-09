-- CreateTable
CREATE TABLE "Meeting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "host_email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "start_url" TEXT NOT NULL,
    "join_url" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" INTEGER,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
