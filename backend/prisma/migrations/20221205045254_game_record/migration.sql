/*
  Warnings:

  - You are about to drop the column `opponentScore` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `userScore` on the `MatchResult` table. All the data in the column will be lost.
  - Added the required column `playerOneScore` to the `MatchResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerTwoScore` to the `MatchResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "opponentScore",
DROP COLUMN "userScore",
ADD COLUMN     "playerOneScore" INTEGER NOT NULL,
ADD COLUMN     "playerTwoScore" INTEGER NOT NULL;
