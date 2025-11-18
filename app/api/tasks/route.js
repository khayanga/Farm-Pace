import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma.js";
import { NextResponse } from "next/server";

const TASK_COLORS = {
  fertilizer: "#7C4A21",
  foliar_fertilizer: "#A8D5BA",
  pesticide: "red",
  fungicide: "#FDBA21",
  irrigation: "#E2F1F4",
};

export async function POST(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      farm_id,
      farmCrop_id,
      title,
      description,
      taskType,
      startDate,
      endDate,
      recurrence,
      assignedUsers,
    } = await req.json();

    // Validate required fields
    if (!title || !taskType || !startDate || !farm_id) {
      return NextResponse.json(
        { error: "Title, task type, start date & farm are required" },
        { status: 400 }
      );
    }

    const cropId = farmCrop_id ? parseInt(farmCrop_id) : null;

    // Validate Farm
    const farm = await db.farm.findUnique({ where: { id: farm_id } });
    if (!farm) {
      return NextResponse.json({ error: "Invalid farm_id" }, { status: 404 });
    }

    if (cropId) {
      const crop = await db.farmCrop.findMany({
        where: { id: cropId, farm_id },
      });

      if (crop.length === 0) {
        return NextResponse.json(
          { error: "FarmCrop does not belong to this farm" },
          { status: 400 }
        );
      }
    }

    // Create Task
    const task = await db.task.create({
      data: {
        farm_id,
        farmCrop_id: cropId,
        title,
        description,
        taskType,
        color: TASK_COLORS[taskType] ?? "#000000",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        recurrence: recurrence || null,
        createdBy: user.user_id,
      },
    });

    // Assigned users
    if (assignedUsers?.length) {
      await db.taskAssignment.createMany({
        data: assignedUsers.map((u) => ({
          task_id: task.id,
          user_id: u,
        })),
      });
    }

    // Return full task info
    const fullTask = await db.task.findUnique({
      where: { id: task.id },
      include: {
        farm: true,
        farmCrop: true,
        assignedTo: { include: { user: true } },
        creator: true,
      },
    });

    return NextResponse.json({ task: fullTask }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
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

    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farmId");
    const cropId = searchParams.get("cropId");

    const tasks = await db.task.findMany({
      where: {
        ...(farmId && { farm_id: farmId }),
        ...(cropId && { farmCrop_id: parseInt(cropId) }),
      },
      include: {
        farm: true,
        farmCrop: true,
        assignedTo: { include: { user: true } },
        creator: true,
        notes: true,
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(tasks ?? [], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
