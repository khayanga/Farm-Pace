import { NextResponse } from "next/server";
import db from "@/lib/prisma";

function parseGpsString(gps) {
  if (!gps || typeof gps !== "string") return null;
  const cleaned = gps.replace(/[°]/g, "").replace(/[A-Za-z]/g, "").trim();
  const parts = cleaned.split(",").map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const lat = Number(parts[0]);
  const lon = Number(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
}

function findNearestIndex(times) {
  if (!Array.isArray(times) || times.length === 0) return 0;
  const now = Date.now();
  let bestIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(Date.parse(times[i]) - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

// ================= POST =================
export async function POST(context) {
  try {
    const { farmId } = await context.params;

    const farm = await db.farm.findUnique({
      where: { id: farmId },
      select: { gps: true },
    });

    if (!farm?.gps)
      return NextResponse.json({ error: "Farm GPS not available" }, { status: 400 });

    const coords = parseGpsString(farm.gps);
    if (!coords)
      return NextResponse.json({ error: "Invalid GPS format" }, { status: 400 });

    const { lat, lon } = coords;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&hourly=temperature_2m,relative_humidity_2m,precipitation,soil_moisture_0_to_10cm` +
        `&timezone=UTC`
    );

    if (!res.ok)
      return NextResponse.json({ error: "Weather API failed" }, { status: 502 });

    const data = await res.json();
    const hourly = data.hourly;

    const idx = findNearestIndex(hourly.time);
    const recordedAtIso = hourly.time[idx];

    const exists = await db.weatherData.findFirst({
      where: { farm_id: farmId, recordedAt: new Date(recordedAtIso) },
    });

    if (exists)
      return NextResponse.json(
        { success: true, message: "Already saved", weather: exists },
        { status: 200 }
      );

    // compute min/max from last 12 hours
    const sliceStart = Math.max(0, idx - 12);
    const tempSlice = hourly.temperature_2m.slice(sliceStart, idx + 1);

    const weather = await db.weatherData.create({
      data: {
        farm_id: farmId,
        temperature: hourly.temperature_2m[idx] ?? null,
        temp_min: Math.min(...tempSlice),
        temp_max: Math.max(...tempSlice),
        humidity: hourly.relative_humidity_2m[idx] ?? null,
        rainfall: hourly.precipitation[idx] ?? null,
        soilMoisture: hourly.soil_moisture_0_to_10cm[idx] ?? null,
        recordedAt: new Date(recordedAtIso),
      },
    });

    return NextResponse.json({ success: true, weather }, { status: 201 });
  } catch (err) {
    console.error("POST /api/weather error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ================= GET =================
export async function GET(_, context) {
  try {
    const { farmId } = await context.params;

    const readings = await db.weatherData.findMany({
      where: { farm_id: farmId },
      orderBy: { recordedAt: "asc" },
    });

    const sensorReadings = await db.sensorData.findMany({
      where: { farm_id: farmId },
      orderBy: { recordedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ readings, sensorReadings });
  } catch (err) {
    console.error("GET /api/weather error:", err);
    return NextResponse.json({ error: "Failed to read weather" }, { status: 500 });
  }
}

