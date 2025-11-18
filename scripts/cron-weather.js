import db from "../lib/prisma.js";
import fetch from "node-fetch";

function parseGpsString(gps) {
  if (!gps) return null;
  const cleaned = gps.replace(/[°]/g, "").replace(/[A-Za-z]/g, "").trim();
  const p = cleaned.split(",").map((s) => s.trim());
  if (p.length < 2) return null;
  const lat = Number(p[0]);
  const lon = Number(p[1]);
  return Number.isNaN(lat) || Number.isNaN(lon) ? null : { lat, lon };
}

async function fetchWeatherForFarm(farm) {
  try {
    const coords = parseGpsString(farm.gps);
    if (!coords) return;

    const { lat, lon } = coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,soil_moisture_0_to_10cm&timezone=UTC`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch weather for farm ${farm.id}`);

    const data = await res.json();
    const hourly = data.hourly;

    const promises = hourly.time.map(async (time, i) => {
      const ts = new Date(time);
      const exists = await db.weatherData.findFirst({
        where: { farm_id: farm.id, recordedAt: ts },
      });
      if (exists) return;

      await db.weatherData.create({
        data: {
          farm_id: farm.id,
          temperature: hourly.temperature_2m[i],
          humidity: hourly.relative_humidity_2m[i],
          rainfall: hourly.precipitation[i],
          soilMoisture: hourly.soil_moisture_0_to_10cm[i],
          recordedAt: ts,
          rawResponse: JSON.stringify({ source: "open-meteo", index: i, lat, lon }),
        },
      });
    });

    await Promise.all(promises);
    console.log(`Finished farm ${farm.id}`);
  } catch (err) {
    console.error(`Error processing farm ${farm.id}:`, err.message);
  }
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

// Run the cron
runCron();
