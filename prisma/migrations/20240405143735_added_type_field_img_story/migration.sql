/*
  Warnings:

  - Added the required column `type_img` to the `ImgStory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImgStory" ADD COLUMN     "type_img" VARCHAR(128) NOT NULL;
