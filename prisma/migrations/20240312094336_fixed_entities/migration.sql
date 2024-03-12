/*
  Warnings:

  - You are about to drop the `AddStoryRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RatingAudio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoryAudio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoryAudioRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AddStoryRequest" DROP CONSTRAINT "AddStoryRequest_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RatingAudio" DROP CONSTRAINT "RatingAudio_story_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "RatingAudio" DROP CONSTRAINT "RatingAudio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_ethnic_group_id_fkey";

-- DropForeignKey
ALTER TABLE "StoryAudio" DROP CONSTRAINT "StoryAudio_author_fkey";

-- DropForeignKey
ALTER TABLE "StoryAudio" DROP CONSTRAINT "StoryAudio_language_id_fkey";

-- DropForeignKey
ALTER TABLE "StoryAudioRequest" DROP CONSTRAINT "StoryAudioRequest_story_id_fkey";

-- DropForeignKey
ALTER TABLE "StoryAudioRequest" DROP CONSTRAINT "StoryAudioRequest_type_id_fkey";

-- DropForeignKey
ALTER TABLE "StoryAudioRequest" DROP CONSTRAINT "StoryAudioRequest_userId_fkey";

-- DropTable
DROP TABLE "AddStoryRequest";

-- DropTable
DROP TABLE "RatingAudio";

-- DropTable
DROP TABLE "Story";

-- DropTable
DROP TABLE "StoryAudio";

-- DropTable
DROP TABLE "StoryAudioRequest";

-- DropTable
DROP TABLE "TypeRequest";

-- CreateTable
CREATE TABLE "stories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "text" TEXT NOT NULL,
    "ethnic_group_id" INTEGER NOT NULL,
    "audio_id" INTEGER,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_audios" (
    "id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "path_to_file" VARCHAR(255) NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "story_audios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audios_rating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "story_audio_id" INTEGER NOT NULL,

    CONSTRAINT "audios_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_requests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "type_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "add_story_requests" (
    "id" SERIAL NOT NULL,
    "story_name" VARCHAR(255) NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "comment" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "add_story_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_audio_requests" (
    "id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "story_audio_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stories_name_key" ON "stories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stories_audio_id_key" ON "stories"("audio_id");

-- CreateIndex
CREATE UNIQUE INDEX "type_requests_name_key" ON "type_requests"("name");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_ethnic_group_id_fkey" FOREIGN KEY ("ethnic_group_id") REFERENCES "ethnic_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "story_audios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audios" ADD CONSTRAINT "story_audios_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audios_rating" ADD CONSTRAINT "audios_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audios_rating" ADD CONSTRAINT "audios_rating_story_audio_id_fkey" FOREIGN KEY ("story_audio_id") REFERENCES "story_audios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "add_story_requests" ADD CONSTRAINT "add_story_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
