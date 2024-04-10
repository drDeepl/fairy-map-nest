/*
  Warnings:

  - Added the required column `language_id` to the `story_audios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "story_audios" ADD COLUMN     "language_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
