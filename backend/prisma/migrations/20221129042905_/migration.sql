/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DmMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DmMessageToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DmToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MessageToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatUserStatus" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Dm" DROP CONSTRAINT "Dm_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "DmMessage" DROP CONSTRAINT "DmMessage_dmId_fkey";

-- DropForeignKey
ALTER TABLE "DmMessage" DROP CONSTRAINT "DmMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_DmMessageToUser" DROP CONSTRAINT "_DmMessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DmMessageToUser" DROP CONSTRAINT "_DmMessageToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_DmToUser" DROP CONSTRAINT "_DmToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DmToUser" DROP CONSTRAINT "_DmToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_B_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Dm";

-- DropTable
DROP TABLE "DmMessage";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_ChatToUser";

-- DropTable
DROP TABLE "_DmMessageToUser";

-- DropTable
DROP TABLE "_DmToUser";

-- DropTable
DROP TABLE "_MessageToUser";

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatRoomId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "chatRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ChatUserStatus" NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("chatRoomId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_name_key" ON "ChatRoom"("name");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
