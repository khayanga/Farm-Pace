import db from "@/lib/prisma";
import { NextResponse } from "next/server";

const DEFAULT_METRICS = [
  { metric: "temperature_day", unit: "°C" },
  { metric: "temperature_night", unit: "°C" },
  { metric: "humidity", unit: "%" },
  { metric: "soil_moisture", unit: "%" },
  { metric: "soil_ph", unit: "pH" },
];

function rand(min, max, decimals = 1) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}

export async function POST(req, context) {
  try {
    const { id: farmId } = await context.params;
    const body = await req.json();

    const farm = await db.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    // Simulate readings
    if (body?.simulate) {
      const count = body.count || 10;
      const toCreate = [];

      for (let i = 0; i < count; i++) {
        for (const m of DEFAULT_METRICS) {
          let value;
          switch (m.metric) {
            case "temperature_day":
              value = rand(14, 36, 1);
              break;
            case "temperature_night":
              value = rand(10, 22, 1);
              break;
            case "humidity":
              value = rand(40, 95, 1);
              break;
            case "soil_moisture":
              value = rand(30, 95, 1);
              break;
            case "soil_ph":
              value = rand(4.5, 7.5, 1);
              break;
            default:
              value = rand(0, 100, 1);
          }

          toCreate.push({
            farm_id: farmId,
            metric: m.metric,
            value,
            unit: m.unit,
            recordedAt: new Date(),
          });
        }
      }

      await db.sensorData.createMany({
        data: toCreate,
      });

      return NextResponse.json(
        { message: "Simulated sensor data inserted", inserted: toCreate.length },
        { status: 201 }
      );
    }

    // Handle real sensor readings
    if (Array.isArray(body?.metrics)) {
      const insert = body.metrics.map((r) => ({
        farm_id: farmId,
        metric: r.metric,
        value: r.value,
        unit: r.unit || null,
        recordedAt: r.recordedAt ? new Date(r.recordedAt) : new Date(),
      }));

      await db.sensorData.createMany({ data: insert });

      return NextResponse.json(
        { message: "Sensor data saved", inserted: insert.length },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Invalid body. Provide metrics array or set simulate:true" },
      { status: 400 }
    );
  } catch (err) {
    console.error("POST /sensor-data error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req, context) {
  try {
    const { id: farmId } = await context.params;
    const farm = await db.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    const rows = await db.sensorData.findMany({
      where: { farm_id: farmId },
      orderBy: { recordedAt: "desc" },
      take: 500,
    });

    const grouped = {};
    for (const r of rows) {
      if (!grouped[r.metric]) grouped[r.metric] = [];
      grouped[r.metric].push({
        id: r.id,
        value: Number(r.value),
        unit: r.unit,
        recordedAt: r.recordedAt,
      });
    }

    for (const k of Object.keys(grouped)) {
      grouped[k].sort(
        (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
      );
    }

    return NextResponse.json({
      farm: { id: farm.id, name: farm.name, code: farm.code },
      data: grouped,
    });
  } catch (err) {
    console.error("GET /sensor-data error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
