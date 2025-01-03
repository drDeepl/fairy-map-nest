/*
  Warnings:

  - You are about to drop the `UserAudioStory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAudioStory" DROP CONSTRAINT "UserAudioStory_language_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAudioStory" DROP CONSTRAINT "UserAudioStory_user_id_fkey";

-- DropForeignKey
ALTER TABLE "story_audio_requests" DROP CONSTRAINT "story_audio_requests_user_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "story_audios" DROP CONSTRAINT "story_audios_user_audio_id_fkey";

-- DropTable
DROP TABLE "UserAudioStory";

-- CreateTable
CREATE TABLE "user_audio_story" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "pathAudio" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_audio_story_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_user_audio_id_fkey" FOREIGN KEY ("user_audio_id") REFERENCES "user_audio_story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_story" ADD CONSTRAINT "user_audio_story_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_story" ADD CONSTRAINT "user_audio_story_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_user_audio_id_fkey" FOREIGN KEY ("user_audio_id") REFERENCES "user_audio_story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
