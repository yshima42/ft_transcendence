-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthSecret" TEXT,
ALTER COLUMN "nickname" DROP DEFAULT;
