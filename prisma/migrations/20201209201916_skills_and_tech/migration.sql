-- CreateTable
CREATE TABLE "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "techId" INTEGER,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("techId") REFERENCES "Tech"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tech" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ZoomAuth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userId" INTEGER,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ZoomAuth" ("id", "token", "userId") SELECT "id", "token", "userId" FROM "ZoomAuth";
DROP TABLE "ZoomAuth";
ALTER TABLE "new_ZoomAuth" RENAME TO "ZoomAuth";
CREATE UNIQUE INDEX "ZoomAuth.userId_unique" ON "ZoomAuth"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
