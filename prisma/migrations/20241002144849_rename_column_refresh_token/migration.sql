/*
  Warnings:

  - You are about to drop the column `refresh_token_hash` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "refresh_token_hash",
ADD COLUMN     "refresh_token" VARCHAR(255);
