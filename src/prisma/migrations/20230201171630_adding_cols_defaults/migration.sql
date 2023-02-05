-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPersistentTokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserPersistentTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPersistentTokens" ("createdAt", "id", "isExpired", "lastUsedAt", "token", "userId") SELECT "createdAt", "id", "isExpired", "lastUsedAt", "token", "userId" FROM "UserPersistentTokens";
DROP TABLE "UserPersistentTokens";
ALTER TABLE "new_UserPersistentTokens" RENAME TO "UserPersistentTokens";
CREATE UNIQUE INDEX "UserPersistentTokens_token_key" ON "UserPersistentTokens"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
