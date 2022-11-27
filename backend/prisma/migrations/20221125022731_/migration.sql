/*
  Warnings:

  - The primary key for the `Block` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blockedById` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `blockingId` on the `Block` table. All the data in the column will be lost.
  - Added the required column `sourceId` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_blockedById_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_blockingId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP CONSTRAINT "Block_pkey",
DROP COLUMN "blockedById",
DROP COLUMN "blockingId",
ADD COLUMN     "sourceId" TEXT NOT NULL,
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD CONSTRAINT "Block_pkey" PRIMARY KEY ("sourceId", "targetId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
