/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_groupId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "groupId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_id_seq";

-- CreateTable
CREATE TABLE "StudentGroup" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
