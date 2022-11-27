-- CreateTable
CREATE TABLE "MatchResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "opponentId" TEXT NOT NULL,
    "userScore" INTEGER NOT NULL,
    "opponentScore" INTEGER NOT NULL,
    "win" BOOLEAN NOT NULL,

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
