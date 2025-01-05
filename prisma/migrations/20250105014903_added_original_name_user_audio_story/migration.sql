/*
  Warnings:

  - You are about to alter the column `name` on the `user_audio_story` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "user_audio_story" ADD COLUMN     "originalName" VARCHAR(64) NOT NULL DEFAULT 'unnamed',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(64);
