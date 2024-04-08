/*
  Warnings:

  - Added the required column `rating` to the `audios_rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audios_rating" ADD COLUMN     "rating" INTEGER NOT NULL;
