
import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma.js";
import { getOccurrencesBetween } from "@/lib/recurrence";
import { NextResponse } from "next/server";

const TASK_COLORS = {
  fertilizer: "#0E7C7B",
  foliar_fertilizer: "#94FBAB",
  pesticide: "#F55536",
  fungicide: "#FABC3C",
  irrigation: "#08605F",
  harvesting: "#EEF36A"
};

export async function POST(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await req.json();

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
    } = payload;

    if (!title || !taskType || !startDate || !farm_id) {
      return NextResponse.json(
        { error: "Title, task type, start date & farm are required" },
        { status: 400 }
      );
    }

    
    const farm = await db.farm.findUnique({ where: { id: farm_id } });
    if (!farm) return NextResponse.json({ error: "Invalid farm_id" }, { status: 404 });

    
    const cropId = farmCrop_id ? parseInt(farmCrop_id) : null;
    if (cropId) {
      const crop = await db.farmCrop.findFirst({ where: { id: cropId, farm_id } });
      if (!crop) return NextResponse.json({ error: "FarmCrop does not belong to this farm" }, { status: 400 });
    }

    
    if (recurrence && typeof recurrence === "object") {
    
      const { frequency, interval = 1, time } = recurrence;
      if (!frequency) {
        return NextResponse.json({ error: "Recurrence frequency required" }, { status: 400 });
      }

      const rec = await db.recurringTask.create({
        data: {
          farm_id,
          farmCrop_id: cropId,
          title,
          description,
          taskType,
          color: TASK_COLORS[taskType] ?? "#000000",
          frequency,
          interval,
          startDate: new Date(startDate),
          time: time ?? "00:00",
          endDate: endDate ? new Date(endDate) : null,
          createdBy: user.user_id,
        },
      });

      // If assignedUsers -> store as assignments on a separate table or create TaskAssignment-like relation for recurring tasks
      if (assignedUsers?.length) {
        // Ensure you have a RecurringTaskAssignment model or reuse TaskAssignment (if you prefer per-instance assignment use other strategy)
        await Promise.all(
          assignedUsers.map((u) =>
            db.recurringTaskAssignment?.create
              ? db.recurringTaskAssignment.create({
                  data: { recurringTask_id: rec.id, user_id: u },
                })
              : Promise.resolve()
          )
        );
      }

      const full = await db.recurringTask.findUnique({
        where: { id: rec.id },
        include: { farm: true, farmCrop: true, creator: true, exceptions: true },
      });

      return NextResponse.json({ recurringTask: full }, { status: 201 });
    }

    // else: one-off Task as before
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
        recurrence: null,
        createdBy: user.user_id,
      },
    });

    // assigned users (same as before)
    if (assignedUsers?.length) {
      await db.taskAssignment.createMany({
        data: assignedUsers.map((u) => ({
          task_id: task.id,
          user_id: u,
        })),
      });
    }

    const fullTask = await db.task.findUnique({
      where: { id: task.id },
      include: { farm: true, farmCrop: true, assignedTo: { include: { user: true } }, creator: true },
    });

    return NextResponse.json({ task: fullTask }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
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

    if (!farmId) {
      return NextResponse.json({ error: "farmId required" }, { status: 400 });
    }

    // Optional date ranges
    let rangeStart = searchParams.get("start");
    let rangeEnd = searchParams.get("end");

    const filterByDate = rangeStart && rangeEnd
      ? {
          startDate: {
            gte: new Date(rangeStart),
            lte: new Date(rangeEnd),
          },
        }
      : {};

    // 1) Fetch one-off tasks
    const oneOffWhere = {
      farm_id: farmId,
      ...(cropId && { farmCrop_id: parseInt(cropId) }),
      ...filterByDate,
    };

    const tasks = await db.task.findMany({
      where: oneOffWhere,
      include: {
        farm: true,
        farmCrop: true,
        assignedTo: { include: { user: true } },
        creator: true,
        notes: { include: { user: true } },
      },
      orderBy: { startDate: "asc" },
    });

    console.log(`Found ${tasks.length} one-off tasks`);

    // 2) Fetch recurring tasks
    const recurringWhere = {
      farm_id: farmId,
      ...(cropId && { farmCrop_id: parseInt(cropId) }),
    };

    const recs = await db.recurringTask.findMany({
      where: recurringWhere,
      include: { exceptions: true, farm: true, farmCrop: true, creator: true },
    });

    console.log(`Found ${recs.length} recurring tasks`);

    // Generate occurrences only if date ranges exist
    const occurrences = [];
    for (const r of recs) {
      try {
        const occs = rangeStart && rangeEnd
          ? getOccurrencesBetween(r, r.exceptions, rangeStart, rangeEnd)
          : []; 

        occs.forEach((o) => {
          occurrences.push({
            id: `rec-${r.id}-${o.startDate.toISOString()}`,
            type: "recurring",
            recurringId: r.id,
            title: o.exception?.modifiedTitle || r.title,
            description: r.description,
            taskType: r.taskType,
            time: r.time,
            color: r.color || TASK_COLORS[r.taskType] || "#000000",
            startDate: o.exception?.modifiedDate ? new Date(o.exception.modifiedDate) : o.startDate,
            farm: r.farm,
            farmCrop: r.farmCrop,
            creator: r.creator,
            exception: o.exception || null,
          });
        });
      } catch (error) {
        console.error(`Error generating occurrences for recurring task ${r.id}:`, error);
      }
    }

    // Format one-off tasks
    const oneOffEvents = tasks.map((t) => ({
      id: `task-${t.id}`,
      type: "one-off",
      taskId: t.id,
      title: t.title,
      description: t.description,
      taskType: t.taskType,
      color: t.color,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      farm: t.farm,
      farmCrop: t.farmCrop,
      assignedTo: t.assignedTo,
      creator: t.creator,
      notes: t.notes,
    }));

    // Combine and sort
    const combined = [...oneOffEvents, ...occurrences].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    console.log(`Returning ${combined.length} total events`);

    return NextResponse.json(combined, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}