-- CreateTable
CREATE TABLE "User" (
"id" SERIAL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoomAuth" (
"id" SERIAL,
    "token" TEXT NOT NULL,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
"id" SERIAL,
    "uuid" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "host_email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "start_url" TEXT NOT NULL,
    "join_url" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackUser" (
"id" SERIAL,
    "slackId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
"id" SERIAL,
    "userId" INTEGER NOT NULL,
    "techId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tech" (
"id" SERIAL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ZoomAuth.userId_unique" ON "ZoomAuth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackUser_userId_unique" ON "SlackUser"("userId");

-- AddForeignKey
ALTER TABLE "ZoomAuth" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlackUser" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD FOREIGN KEY("techId")REFERENCES "Tech"("id") ON DELETE CASCADE ON UPDATE CASCADE;
