// import { getCurrentUser } from "@/lib/getCurrentUser";
// import db from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req, context) {
//   try {
//     const user = await getCurrentUser(req);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const params = await context.params;
//     const id = params.id;
//     if (!id) {
//       return NextResponse.json({ error: "Missing sensor ID" }, { status: 400 });
//     }

//     const body = await req.json();

//     const sensor = await db.sensor.findUnique({
//       where: { id: Number(id) },
//     });
//     const metricsData = body.map((m) => ({
//       sensor_id: sensor.id,
//       farm_id: sensor.farm_id,
//       metric: m.metric,
//       value: parseFloat(m.value),
//       unit: m.unit,
//     }));

//     const result = await db.sensorData.createMany({
//       data: metricsData,
//       skipDuplicates: true,
//     });

//     return NextResponse.json(
//       { message: "Metrics recorded", count: result.count },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error saving sensor metrics:", error);
//     return NextResponse.json(
//       { error: "Failed to save sensor metrics" },
//       { status: 500 }
//     );
//   }
// }
import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma.js";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sensorId } = await context.params;

    if (!sensorId) {
      return NextResponse.json({ error: "Missing sensor ID" }, { status: 400 });
    }

    const body = await req.json();

    const sensor = await db.sensor.findUnique({
      where: { id: Number(sensorId) },
    });

    if (!sensor) {
      return NextResponse.json({ error: "Sensor not found" }, { status: 404 });
    }

    const metricsData = body.map((m) => ({
      sensor_id: sensor.id,
      farm_id: sensor.farm_id,
      metric: m.metric,
      value: parseFloat(m.value),
      unit: m.unit,
    }));

    const result = await db.sensorData.createMany({
      data: metricsData,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "Metrics recorded", count: result.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving sensor metrics:", error);
    return NextResponse.json(
      { error: "Failed to save sensor metrics" },
      { status: 500 }
    );
  }
}


export async function GET( req, context) {
  try {
    const { sensorId } = await context.params;
    if (!sensorId) {
      return NextResponse.json({ error: "Missing sensor ID" }, { status: 400 });
    }

    const readings = await db.sensorData.findMany({
      where: { sensor_id: Number(sensorId) },
      orderBy: { recordedAt: "desc" },
      select: {
        id: true,
        metric: true,
        value: true,
        unit: true,
        recordedAt: true,
      },
    });

    return NextResponse.json({ readings });
  } catch (error) {
    console.error("Error fetching sensor metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch sensor metrics" },
      { status: 500 }
    );
  }
}