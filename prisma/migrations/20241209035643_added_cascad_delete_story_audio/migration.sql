-- DropForeignKey
ALTER TABLE "story_audios" DROP CONSTRAINT "story_audios_user_audio_id_fkey";

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_user_audio_id_fkey" FOREIGN KEY ("user_audio_id") REFERENCES "user_audio_story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
