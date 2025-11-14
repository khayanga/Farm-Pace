/*
  Warnings:

  - You are about to drop the column `crop_id` on the `CropTemplate` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `CropTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CropTemplate" DROP CONSTRAINT "CropTemplate_crop_id_fkey";

-- AlterTable
ALTER TABLE "CropTemplate" DROP COLUMN "crop_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
