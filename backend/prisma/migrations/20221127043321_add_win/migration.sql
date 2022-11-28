/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `opponentId` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MatchResult` table. All the data in the column will be lost.
  - Added the required column `finishededAt` to the `MatchResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerOneId` to the `MatchResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerTwoId` to the `MatchResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MatchResult" DROP CONSTRAINT "MatchResult_opponentId_fkey";

-- DropForeignKey
ALTER TABLE "MatchResult" DROP CONSTRAINT "MatchResult_userId_fkey";

-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "createdAt",
DROP COLUMN "opponentId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "finishededAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "playerOneId" TEXT NOT NULL,
ADD COLUMN     "playerTwoId" TEXT NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
