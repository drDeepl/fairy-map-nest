/*
  Warnings:

  - You are about to drop the column `constituent_rf_id` on the `ethnic_group_map_points` table. All the data in the column will be lost.
  - Added the required column `constituent_id` to the `ethnic_group_map_points` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ethnic_group_map_points" DROP CONSTRAINT "ethnic_group_map_points_constituent_rf_id_fkey";

-- AlterTable
ALTER TABLE "ethnic_group_map_points" DROP COLUMN "constituent_rf_id",
ADD COLUMN     "constituent_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ethnic_group_map_points" ADD CONSTRAINT "ethnic_group_map_points_constituent_id_fkey" FOREIGN KEY ("constituent_id") REFERENCES "constituents_rf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
