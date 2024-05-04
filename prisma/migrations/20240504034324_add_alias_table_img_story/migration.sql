/*
  Warnings:

  - You are about to drop the `ImgStory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImgStory" DROP CONSTRAINT "ImgStory_story_id_fkey";

-- DropTable
DROP TABLE "ImgStory";

-- CreateTable
CREATE TABLE "img_story" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "story_id" INTEGER NOT NULL,

    CONSTRAINT "img_story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "img_story_story_id_key" ON "img_story"("story_id");

-- AddForeignKey
ALTER TABLE "img_story" ADD CONSTRAINT "img_story_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
