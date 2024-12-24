/*
  Warnings:

  - You are about to drop the column `type_id` on the `story_audio_requests` table. All the data in the column will be lost.
  - You are about to drop the `type_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TypeRequest" AS ENUM ('добавление', 'редактирование', 'удаление');

-- DropForeignKey
ALTER TABLE "story_audio_requests" DROP CONSTRAINT "story_audio_requests_type_id_fkey";

-- AlterTable
ALTER TABLE "story_audio_requests" DROP COLUMN "type_id",
ADD COLUMN     "typeRequest" "TypeRequest" NOT NULL DEFAULT 'добавление';

-- DropTable
DROP TABLE "type_requests";
