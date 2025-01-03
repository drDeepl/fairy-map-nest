/*
  Warnings:

  - You are about to drop the column `audio_id` on the `stories` table. All the data in the column will be lost.
  - Added the required column `story_id` to the `story_audios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_audio_id_fkey";

-- DropIndex
DROP INDEX "stories_audio_id_key";

-- AlterTable
ALTER TABLE "stories" DROP COLUMN "audio_id";

-- AlterTable
ALTER TABLE "story_audios" ADD COLUMN     "story_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
