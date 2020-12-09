/*
  Warnings:

  - Added the required column `userId` to the `ZoomAuth` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ZoomAuth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ZoomAuth" ("id", "token") SELECT "id", "token" FROM "ZoomAuth";
DROP TABLE "ZoomAuth";
ALTER TABLE "new_ZoomAuth" RENAME TO "ZoomAuth";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
