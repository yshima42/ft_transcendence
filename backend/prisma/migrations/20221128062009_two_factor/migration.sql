-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthenticationSecret" TEXT;
