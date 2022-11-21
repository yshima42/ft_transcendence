/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OnlineStatus" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nickname" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "onlineStatus" "OnlineStatus" NOT NULL DEFAULT 'ONLINE';

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
