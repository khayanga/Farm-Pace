import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

function formatSensorCode(number) {
  return `SENSOR-${number.toString().padStart(3, "0")}`;
}

export async function POST(req) {
  try {
    const user = await getCurrentUser(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmCode, description } = await req.json();

    if (!farmCode) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const farm = await db.farm.findUnique({ where: { code: farmCode } });

    if (!farm) {r
      return NextResponse.json(
        { error: "Farm code is not available" },
        { status: 404 }
      );
    }

    const count = await db.sensor.count();
    const code = formatSensorCode(count + 1);

    const sensor = await db.sensor.create({
      data: {
        code,
        farm_id: farm.id,
        description: description || null,
      },
    });

    return NextResponse.json(
      { message: "Sensor created", sensor },
      { status: 201 }
    );
  } catch (err) {
    console.error("Could not create sensor", err);
    return NextResponse.json(
      { error: "Error creating sensor" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const sensors = await db.sensor.findMany({
      include: {
        farm: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = sensors.map((sensor) => ({
      id: sensor.id,
      code: sensor.code,
      description: sensor.description,
      createdAt: sensor.createdAt,
      updatedAt: sensor.updatedAt,
      farm: sensor.farm,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("Error fetching sensors", err);
    return NextResponse.json(
      { error: "Could not fetch sensors" },
      { status: 500 }
    );
  }
}
