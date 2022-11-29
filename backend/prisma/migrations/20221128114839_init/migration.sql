/*
  Warnings:

  - You are about to drop the `DM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DMMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DMMessageToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DMToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DM" DROP CONSTRAINT "DM_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "DMMessage" DROP CONSTRAINT "DMMessage_DmId_fkey";

-- DropForeignKey
ALTER TABLE "DMMessage" DROP CONSTRAINT "DMMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_DMMessageToUser" DROP CONSTRAINT "_DMMessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DMMessageToUser" DROP CONSTRAINT "_DMMessageToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_DMToUser" DROP CONSTRAINT "_DMToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DMToUser" DROP CONSTRAINT "_DMToUser_B_fkey";

-- DropTable
DROP TABLE "DM";

-- DropTable
DROP TABLE "DMMessage";

-- DropTable
DROP TABLE "_DMMessageToUser";

-- DropTable
DROP TABLE "_DMToUser";

-- CreateTable
CREATE TABLE "DmMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dmId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "DmMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dm" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Dm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DmMessageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DmToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DmMessageToUser_AB_unique" ON "_DmMessageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DmMessageToUser_B_index" ON "_DmMessageToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DmToUser_AB_unique" ON "_DmToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DmToUser_B_index" ON "_DmToUser"("B");

-- AddForeignKey
ALTER TABLE "DmMessage" ADD CONSTRAINT "DmMessage_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "Dm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DmMessage" ADD CONSTRAINT "DmMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dm" ADD CONSTRAINT "Dm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmMessageToUser" ADD CONSTRAINT "_DmMessageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DmMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmMessageToUser" ADD CONSTRAINT "_DmMessageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmToUser" ADD CONSTRAINT "_DmToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Dm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmToUser" ADD CONSTRAINT "_DmToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
