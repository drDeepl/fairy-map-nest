-- AlterTable
ALTER TABLE "ethnic_group_map_points" ADD COLUMN     "constituent_rf_id" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ethnic_group_map_points" ADD CONSTRAINT "ethnic_group_map_points_constituent_rf_id_fkey" FOREIGN KEY ("constituent_rf_id") REFERENCES "constituents_rf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
