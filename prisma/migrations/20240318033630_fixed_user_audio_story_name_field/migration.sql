/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UserAudioStory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserAudioStory_name_key" ON "UserAudioStory"("name");
