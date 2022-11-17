-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FRIEND', 'INCOMING', 'OUTGOING');

-- CreateTable
CREATE TABLE "Relationship" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "peerId" TEXT NOT NULL,
    "type" "RelationshipType" NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("userId","peerId")
);

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
