-- DropForeignKey
ALTER TABLE "img_story" DROP CONSTRAINT "img_story_story_id_fkey";

-- AddForeignKey
ALTER TABLE "img_story" ADD CONSTRAINT "img_story_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
