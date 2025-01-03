/*
  Warnings:

  - You are about to drop the column `userId` on the `AddStoryRequest` table. All the data in the column will be lost.
  - You are about to drop the column `storyAudioId` on the `RatingAudio` table. All the data in the column will be lost.
  - You are about to drop the column `audioId` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `ethnicGroupId` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `StoryAudio` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `StoryAudio` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audio_id]` on the table `Story` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[first_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[last_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `AddStoryRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `story_audio_id` to the `RatingAudio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio_id` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ethnic_group_id` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_public` to the `StoryAudio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `StoryAudio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AddStoryRequest" DROP CONSTRAINT "AddStoryRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "RatingAudio" DROP CONSTRAINT "RatingAudio_storyAudioId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_audioId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_ethnicGroupId_fkey";

-- DropForeignKey
ALTER TABLE "StoryAudio" DROP CONSTRAINT "StoryAudio_languageId_fkey";

-- DropIndex
DROP INDEX "Story_audioId_key";

-- DropIndex
DROP INDEX "users_firstName_key";

-- DropIndex
DROP INDEX "users_lastName_key";

-- AlterTable
ALTER TABLE "AddStoryRequest" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RatingAudio" DROP COLUMN "storyAudioId",
ADD COLUMN     "story_audio_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "audioId",
DROP COLUMN "ethnicGroupId",
DROP COLUMN "isPublic",
ADD COLUMN     "audio_id" INTEGER NOT NULL,
ADD COLUMN     "ethnic_group_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StoryAudio" DROP COLUMN "isPublic",
DROP COLUMN "languageId",
ADD COLUMN     "is_public" BOOLEAN NOT NULL,
ADD COLUMN     "language_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "first_name" VARCHAR(64) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(64) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Story_audio_id_key" ON "Story"("audio_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_first_name_key" ON "users"("first_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_last_name_key" ON "users"("last_name");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_ethnic_group_id_fkey" FOREIGN KEY ("ethnic_group_id") REFERENCES "ethnic_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "StoryAudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAudio" ADD CONSTRAINT "StoryAudio_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingAudio" ADD CONSTRAINT "RatingAudio_story_audio_id_fkey" FOREIGN KEY ("story_audio_id") REFERENCES "StoryAudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddStoryRequest" ADD CONSTRAINT "AddStoryRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
