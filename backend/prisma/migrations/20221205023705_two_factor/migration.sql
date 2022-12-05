/*
  Warnings:

  - You are about to drop the column `finishededAt` on the `MatchResult` table. All the data in the column will be lost.
  - Added the required column `finishedAt` to the `MatchResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "finishededAt",
ADD COLUMN     "finishedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthSecret" TEXT,
ALTER COLUMN "nickname" DROP DEFAULT;
