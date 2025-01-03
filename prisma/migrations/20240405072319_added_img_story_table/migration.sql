-- CreateTable
CREATE TABLE "ImgStory" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "story_id" INTEGER NOT NULL,

    CONSTRAINT "ImgStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImgStory_story_id_key" ON "ImgStory"("story_id");

-- AddForeignKey
ALTER TABLE "ImgStory" ADD CONSTRAINT "ImgStory_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
