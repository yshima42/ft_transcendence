-- AlterEnum
ALTER TYPE "RelationshipType" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "Relationship" ADD COLUMN     "isBlocking" BOOLEAN NOT NULL DEFAULT false;
