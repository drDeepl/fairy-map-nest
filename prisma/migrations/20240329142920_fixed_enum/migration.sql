/*
  Warnings:

  - You are about to drop the column `status_id` on the `add_story_requests` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `story_audio_requests` table. All the data in the column will be lost.
  - You are about to drop the `RequestStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('отправлено', 'одобрено', 'отклонено');

-- DropForeignKey
ALTER TABLE "add_story_requests" DROP CONSTRAINT "add_story_requests_status_id_fkey";

-- DropForeignKey
ALTER TABLE "story_audio_requests" DROP CONSTRAINT "story_audio_requests_status_id_fkey";

-- AlterTable
ALTER TABLE "add_story_requests" DROP COLUMN "status_id",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'отправлено';

-- AlterTable
ALTER TABLE "story_audio_requests" DROP COLUMN "status_id",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'отправлено';

-- DropTable
DROP TABLE "RequestStatus";
