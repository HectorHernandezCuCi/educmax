-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentCommentId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
