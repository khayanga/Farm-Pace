-- CreateTable
CREATE TABLE "WeatherData" (
    "id" SERIAL NOT NULL,
    "farm_id" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "soilMoisture" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeatherData" ADD CONSTRAINT "WeatherData_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
