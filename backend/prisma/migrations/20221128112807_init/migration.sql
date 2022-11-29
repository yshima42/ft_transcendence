/*
  Warnings:

  - You are about to drop the column `DMId` on the `DMMessage` table. All the data in the column will be lost.
  - Added the required column `DmId` to the `DMMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DMMessage" DROP CONSTRAINT "DMMessage_DMId_fkey";

-- AlterTable
ALTER TABLE "DMMessage" DROP COLUMN "DMId",
ADD COLUMN     "DmId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DMMessage" ADD CONSTRAINT "DMMessage_DmId_fkey" FOREIGN KEY ("DmId") REFERENCES "DM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
