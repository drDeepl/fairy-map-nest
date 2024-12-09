-- DropForeignKey
ALTER TABLE "text_stories" DROP CONSTRAINT "text_stories_story_id_fkey";

-- AddForeignKey
ALTER TABLE "text_stories" ADD CONSTRAINT "text_stories_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
