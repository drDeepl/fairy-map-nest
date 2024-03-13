/*
  Warnings:

  - You are about to drop the column `is_public` on the `story_audios` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `story_audios` table. All the data in the column will be lost.
  - You are about to drop the column `path_to_file` on the `story_audios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_audio_id]` on the table `story_audios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_audio_id` to the `story_audios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "story_audios" DROP CONSTRAINT "story_audios_language_id_fkey";

-- AlterTable
ALTER TABLE "story_audios" DROP COLUMN "is_public",
DROP COLUMN "language_id",
DROP COLUMN "path_to_file",
ADD COLUMN     "user_audio_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserAudioStory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "pathAudio" VARCHAR(255) NOT NULL,

    CONSTRAINT "UserAudioStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "story_audios_user_audio_id_key" ON "story_audios"("user_audio_id");

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_user_audio_id_fkey" FOREIGN KEY ("user_audio_id") REFERENCES "UserAudioStory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAudioStory" ADD CONSTRAINT "UserAudioStory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAudioStory" ADD CONSTRAINT "UserAudioStory_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
