-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(64) NOT NULL,
    "last_name" VARCHAR(64) NOT NULL,
    "role" VARCHAR(64) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "refresh_token_hash" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constituents_rf" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "constituents_rf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnic_groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "ethnic_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constituents_rf_ethnic_groups" (
    "id" SERIAL NOT NULL,
    "ethnic_group_id" INTEGER NOT NULL,
    "constituent_rf_id" INTEGER NOT NULL,

    CONSTRAINT "constituents_rf_ethnic_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnic_group_map_points" (
    "id" SERIAL NOT NULL,
    "ethnic_group_id" INTEGER NOT NULL,

    CONSTRAINT "ethnic_group_map_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "text" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "ethnicGroupId" INTEGER NOT NULL,
    "audioId" INTEGER NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAudio" (
    "id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "path_to_file" VARCHAR(255) NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "StoryAudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingAudio" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storyAudioId" INTEGER NOT NULL,

    CONSTRAINT "RatingAudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeRequest" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "TypeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddStoryRequest" (
    "id" SERIAL NOT NULL,
    "story_name" VARCHAR(255) NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AddStoryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAudioRequest" (
    "id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StoryAudioRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_first_name_key" ON "users"("first_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_last_name_key" ON "users"("last_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "constituents_rf_name_key" ON "constituents_rf"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ethnic_groups_name_key" ON "ethnic_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ethnic_groups_language_id_key" ON "ethnic_groups"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Story_name_key" ON "Story"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Story_audioId_key" ON "Story"("audioId");

-- CreateIndex
CREATE UNIQUE INDEX "TypeRequest_name_key" ON "TypeRequest"("name");

-- AddForeignKey
ALTER TABLE "ethnic_groups" ADD CONSTRAINT "ethnic_groups_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constituents_rf_ethnic_groups" ADD CONSTRAINT "constituents_rf_ethnic_groups_ethnic_group_id_fkey" FOREIGN KEY ("ethnic_group_id") REFERENCES "ethnic_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constituents_rf_ethnic_groups" ADD CONSTRAINT "constituents_rf_ethnic_groups_constituent_rf_id_fkey" FOREIGN KEY ("constituent_rf_id") REFERENCES "constituents_rf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ethnic_group_map_points" ADD CONSTRAINT "ethnic_group_map_points_ethnic_group_id_fkey" FOREIGN KEY ("ethnic_group_id") REFERENCES "ethnic_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_ethnicGroupId_fkey" FOREIGN KEY ("ethnicGroupId") REFERENCES "ethnic_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "StoryAudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAudio" ADD CONSTRAINT "StoryAudio_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAudio" ADD CONSTRAINT "StoryAudio_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingAudio" ADD CONSTRAINT "RatingAudio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingAudio" ADD CONSTRAINT "RatingAudio_storyAudioId_fkey" FOREIGN KEY ("storyAudioId") REFERENCES "StoryAudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddStoryRequest" ADD CONSTRAINT "AddStoryRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAudioRequest" ADD CONSTRAINT "StoryAudioRequest_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAudioRequest" ADD CONSTRAINT "StoryAudioRequest_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "TypeRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAudioRequest" ADD CONSTRAINT "StoryAudioRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
