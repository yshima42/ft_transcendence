/*
  Warnings:

  - You are about to drop the column `isTwoFactorAuthenticationEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorAuthenticationSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isTwoFactorAuthenticationEnabled",
DROP COLUMN "twoFactorAuthenticationSecret",
ADD COLUMN     "isTwoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthSecret" TEXT;
