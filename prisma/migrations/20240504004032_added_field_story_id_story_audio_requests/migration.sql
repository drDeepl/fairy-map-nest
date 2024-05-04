/*
  Warnings:

  - Added the required column `storyId` to the `story_audio_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "story_audio_requests" ADD COLUMN     "storyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
