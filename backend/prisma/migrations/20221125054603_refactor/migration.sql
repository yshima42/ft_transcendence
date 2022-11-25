/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `avatarImageUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
ADD COLUMN     "avatarImageUrl" TEXT NOT NULL;
