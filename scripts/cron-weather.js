import db from "../lib/prisma.js";
import fetch from "node-fetch";

function parseGpsString(gps) {
  if (!gps) return null;
  const cleaned = gps.replace(/[°]/g, "").replace(/[A-Za-z]/g, "").trim();
  const parts = cleaned.split(",").map(s => s.trim());
  if (parts.length < 2) return null;
  const lat = Number(parts[0]);
  const lon = Number(parts[1]);
  return Number.isNaN(lat) || Number.isNaN(lon) ? null : { lat, lon };
}

function getLast12HoursRange() {
  const end = new Date();
  const start = new Date(end.getTime() - 12 * 60 * 60 * 1000); 
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

async function fetchWeatherForFarm(farm) {
  const coords = parseGpsString(farm.gps);
  if (!coords) return;

  const { startDate, endDate } = getLast12HoursRange();

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
              `&hourly=temperature_2m,relative_humidity_2m,precipitation,soil_moisture_0_to_10cm` +
              `&timezone=UTC&start_date=${startDate}&end_date=${endDate}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch weather for farm ${farm.id}`);

  const data = await res.json();
  let newRecords = 0;

  for (let i = 0; i < data.hourly.time.length; i++) {
    const ts = new Date(data.hourly.time[i]);
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    if (ts < twelveHoursAgo) continue; 

    const exists = await db.weatherData.findFirst({ where: { farm_id: farm.id, recordedAt: ts } });
    if (exists) continue;

    await db.weatherData.create({
      data: {
        farm_id: farm.id,
        temperature: data.hourly.temperature_2m[i],
        humidity: data.hourly.relative_humidity_2m[i],
        rainfall: data.hourly.precipitation[i],
        soilMoisture: data.hourly.soil_moisture_0_to_10cm[i],
        recordedAt: ts,
      },
    });

    newRecords++;
  }

  console.log(`Finished farm ${farm.id}, added ${newRecords} new records`);
}

async function runCron() {
  try {
    console.log("Cron started at", new Date());
    const farms = await db.farm.findMany({ select: { id: true, gps: true } });
    await Promise.all(farms.map(fetchWeatherForFarm));
    console.log("Cron finished at", new Date());
    process.exit(0);
  } catch (err) {
    console.error("Cron failed:", err);
    process.exit(1);
  }
}

runCron();
