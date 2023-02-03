/*
  Warnings:

  - Added the required column `createdAt` to the `UserPersistentTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUsedAt` to the `UserPersistentTokens` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPersistentTokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "lastUsedAt" DATETIME NOT NULL,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserPersistentTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPersistentTokens" ("id", "token", "userId") SELECT "id", "token", "userId" FROM "UserPersistentTokens";
DROP TABLE "UserPersistentTokens";
ALTER TABLE "new_UserPersistentTokens" RENAME TO "UserPersistentTokens";
CREATE UNIQUE INDEX "UserPersistentTokens_token_key" ON "UserPersistentTokens"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
