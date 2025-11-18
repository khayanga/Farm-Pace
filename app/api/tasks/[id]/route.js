import { NextResponse } from "next/server";
import db from "@/lib/prisma.js";
import { getCurrentUser } from "@/lib/getCurrentUser";


const TASK_COLORS = {
  fertilizer: "#7C4A21",
  foliar_fertilizer: "#A8D5BA",
  pesticide: "red",
  fungicide: "#FDBA21",
  irrigation: "#E2F1F4",
};


export async function PATCH(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const data = await req.json();

    let {
      farmCrop_id,
      title,
      description,
      taskType,
      startDate,
      endDate,
      recurrence,
      assignedUsers,
    } = data;

    
    const cropId = farmCrop_id ? parseInt(farmCrop_id) : null;

    // Ensure task exists
    const existing = await db.task.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Update Task
    const updated = await db.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        taskType,
        color: TASK_COLORS[taskType] ?? existing.color,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : null,
        recurrence: recurrence || null,
        farmCrop_id: cropId,
      },
    });

    // Update Assigned Users
    if (assignedUsers) {
      await db.taskAssignment.deleteMany({
        where: { task_id: updated.id },
      });

      if (assignedUsers.length > 0) {
        await db.taskAssignment.createMany({
          data: assignedUsers.map((userId) => ({
            task_id: updated.id,
            user_id: userId,
          })),
        });
      }
    }

    const fullTask = await db.task.findUnique({
      where: { id: updated.id },
      include: {
        farm: true,
        farmCrop: true,
        assignedTo: { include: { user: true } },
        creator: true,
      },
    });

    return NextResponse.json({ task: fullTask }, {status:201});

  } catch (err) {
    console.error("Error updating task:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
