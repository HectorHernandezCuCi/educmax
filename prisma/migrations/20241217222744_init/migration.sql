/*
  Warnings:

  - You are about to drop the column `role` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'teacher';
