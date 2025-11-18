-- AlterTable
ALTER TABLE "WeatherData" ADD COLUMN     "rainfall" DOUBLE PRECISION,
ADD COLUMN     "temp_max" DOUBLE PRECISION,
ADD COLUMN     "temp_min" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "WeatherData_farm_id_recordedAt_idx" ON "WeatherData"("farm_id", "recordedAt");
