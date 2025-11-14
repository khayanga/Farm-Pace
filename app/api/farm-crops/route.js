
import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmId, templateId, variety, seedlings } = await req.json();

    if (!farmId || !templateId || !variety) {
      return NextResponse.json(
        { error: "farmId, templateId, and variety are required" },
        { status: 400 }
      );
    }

    const farm = await db.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    const template = await db.cropTemplate.findUnique({ where: { id: templateId } });
    if (!template) {
      return NextResponse.json({ error: "Crop template not found" }, { status: 404 });
    }

    const farmCrop = await db.farmCrop.create({
      data: {
        farm_id: farmId,
        template_id: templateId,
        variety,
        seedlings,
      },
      include: {
        farm: true,
        template: true,
      },
    });

    return NextResponse.json(farmCrop, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create farm crop" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const farmCrops = await db.farmCrop.findMany({
      include: {
        farm: true,
        template: true,
      },
      orderBy: {
        plantedAt: 'desc', 
      },
    });

    return NextResponse.json(farmCrops);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch farm crops" }, { status: 500 });
  }
}