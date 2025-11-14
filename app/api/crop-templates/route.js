import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function POST(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmId, name, category } = await req.json();

    if (!farmId || !name || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const farm = await db.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    const template = await db.cropTemplate.create({
      data: {
        name,
        category,
        farm_id: farm.id
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create crop template" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const templates = await db.cropTemplate.findMany({
      include: {
        farm: true,
      },
    });

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch crop templates" },
      { status: 500 }
    );
  }
}