/*
  Warnings:

  - A unique constraint covering the columns `[farmNumber]` on the table `Farm` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "farmNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Farm_farmNumber_key" ON "Farm"("farmNumber");
