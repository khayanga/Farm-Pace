-- CreateEnum
CREATE TYPE "SensorMetric" AS ENUM ('temperature_day', 'temperature_night', 'humidity', 'soil_moisture', 'soil_ph', 'co2');

-- CreateTable
CREATE TABLE "SensorData" (
    "id" SERIAL NOT NULL,
    "farm_id" TEXT NOT NULL,
    "crop_id" INTEGER,
    "metric" "SensorMetric" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "FarmCrop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
