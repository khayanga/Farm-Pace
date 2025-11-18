import db from "@/lib/prisma";

function parseGpsString(gps) {
  if (!gps) return null;
  const cleaned = gps.replace(/[°]/g, "").replace(/[A-Za-z]/g, "").trim();
  const p = cleaned.split(",").map(s => s.trim());
  if (p.length < 2) return null;
  const lat = Number(p[0]);
  const lon = Number(p[1]);
  return Number.isNaN(lat) || Number.isNaN(lon) ? null : { lat, lon };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const forceRun = url.searchParams.get("force") === "true";

    if (forceRun) {
      console.log("Manual cron triggered at", new Date());
      return new Response(JSON.stringify({ success: true, triggeredAt: new Date() }), {
        status: 200,
      });
    }

    console.log("Scheduled cron triggered at", new Date());

    const farms = await db.farm.findMany({ select: { id: true, gps: true } });

    for (const farm of farms) {
      try {
        const coords = parseGpsString(farm.gps);
        if (!coords) continue;

        const { lat, lon } = coords;

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,soil_moisture_0_to_10cm&timezone=UTC`;

        const weatherRes = await fetch(apiUrl);
        if (!weatherRes.ok) continue;

        const data = await weatherRes.json();
        const hourly = data.hourly;

        for (let i = 0; i < hourly.time.length; i++) {
          const ts = new Date(hourly.time[i]);

          const exists = await db.weatherData.findFirst({
            where: { farm_id: farm.id, recordedAt: ts },
          });
          if (exists) continue;

          await db.weatherData.create({
            data: {
              farm_id: farm.id,
              temperature: hourly.temperature_2m[i],
              humidity: hourly.relative_humidity_2m[i],
              rainfall: hourly.precipitation[i],
              soilMoisture: hourly.soil_moisture_0_to_10cm[i],
              recordedAt: ts,
              rawResponse: JSON.stringify({
                source: "open-meteo",
                index: i,
                lat,
                lon,
              }),
            },
          });
        }
      } catch (farmErr) {
        console.error(`Failed farm ${farm.id}`, farmErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Cron failed:", err);
    return new Response(JSON.stringify({ error: "cron-failed" }), { status: 500 });
  }
}
