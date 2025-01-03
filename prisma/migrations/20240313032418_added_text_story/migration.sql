/*
  Warnings:

  - You are about to drop the column `text` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "text";

-- CreateTable
CREATE TABLE "text_stories" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "story_id" INTEGER NOT NULL,

    CONSTRAINT "text_stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "text_stories_story_id_key" ON "text_stories"("story_id");

-- AddForeignKey
ALTER TABLE "text_stories" ADD CONSTRAINT "text_stories_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
