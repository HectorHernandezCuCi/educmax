/*
  Warnings:

  - You are about to drop the column `age` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentDate` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `parentNames` on the `Student` table. All the data in the column will be lost.
  - Added the required column `listNumer` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'teacher';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "age",
DROP COLUMN "emergencyContact",
DROP COLUMN "enrollmentDate",
DROP COLUMN "fullName",
DROP COLUMN "gender",
DROP COLUMN "notes",
DROP COLUMN "parentNames",
ADD COLUMN     "listNumer" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
