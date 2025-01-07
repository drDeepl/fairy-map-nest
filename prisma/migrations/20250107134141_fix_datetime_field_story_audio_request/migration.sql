/*
  Warnings:

  - You are about to drop the column `updateAt` on the `story_audio_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "story_audio_requests" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);
