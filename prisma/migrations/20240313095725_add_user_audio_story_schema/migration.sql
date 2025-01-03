/*
  Warnings:

  - You are about to drop the column `story_id` on the `story_audio_requests` table. All the data in the column will be lost.
  - Added the required column `name` to the `UserAudioStory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_audio_id` to the `story_audio_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "story_audio_requests" DROP CONSTRAINT "story_audio_requests_story_id_fkey";

-- AlterTable
ALTER TABLE "UserAudioStory" ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "story_audio_requests" DROP COLUMN "story_id",
ADD COLUMN     "user_audio_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_user_audio_id_fkey" FOREIGN KEY ("user_audio_id") REFERENCES "UserAudioStory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
