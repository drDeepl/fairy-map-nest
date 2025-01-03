/*
  Warnings:

  - Added the required column `moderateScore` to the `story_audios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "story_audios" ADD COLUMN     "moderateScore" INTEGER NOT NULL;
