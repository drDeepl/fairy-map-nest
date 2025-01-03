/*
  Warnings:

  - You are about to drop the column `status` on the `add_story_requests` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `story_audio_requests` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `add_story_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `story_audio_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "add_story_requests" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "story_audio_requests" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RequestStatus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "RequestStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestStatus_name_key" ON "RequestStatus"("name");

-- AddForeignKey
ALTER TABLE "add_story_requests" ADD CONSTRAINT "add_story_requests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "RequestStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_audio_requests" ADD CONSTRAINT "story_audio_requests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "RequestStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
