/*
  Warnings:

  - You are about to drop the column `crop_id` on the `FarmCrop` table. All the data in the column will be lost.
  - Added the required column `template_id` to the `FarmCrop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'marketer';

-- DropForeignKey
ALTER TABLE "public"."FarmCrop" DROP CONSTRAINT "FarmCrop_crop_id_fkey";

-- AlterTable
ALTER TABLE "FarmCrop" DROP COLUMN "crop_id",
ADD COLUMN     "seedlings" INTEGER,
ADD COLUMN     "template_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CropTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "farm_id" TEXT NOT NULL,
    "crop_id" INTEGER NOT NULL,
    "category" TEXT,

    CONSTRAINT "CropTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CropTemplate" ADD CONSTRAINT "CropTemplate_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropTemplate" ADD CONSTRAINT "CropTemplate_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmCrop" ADD CONSTRAINT "FarmCrop_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "CropTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
