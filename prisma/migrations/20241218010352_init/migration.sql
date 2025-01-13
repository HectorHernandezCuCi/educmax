/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `listNumer` on the `Student` table. All the data in the column will be lost.
  - Added the required column `listNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_groupId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Group_id_seq";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "listNumer",
ADD COLUMN     "listNumber" INTEGER NOT NULL,
ALTER COLUMN "groupId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "TeacherGroup" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "TeacherGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeacherGroup_userId_groupId_key" ON "TeacherGroup"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
