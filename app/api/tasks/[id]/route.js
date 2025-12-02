import { NextResponse } from "next/server";
import db from "@/lib/prisma.js";
import { getCurrentUser } from "@/lib/getCurrentUser";

const TASK_COLORS = {
  fertilizer: "#0E7C7B",
  foliar_fertilizer: "#94FBAB",
  pesticide: "#F55536",
  fungicide: "#FABC3C",
  irrigation: "#08605F",
  harvesting: "#EEF36A",
};

export async function PATCH(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    let cleanId = String(id);

    if (cleanId.startsWith("task-")) {
      cleanId = cleanId.replace("task-", "");
    }

    let numericId;
    let isRecurring = false;

    if (cleanId.startsWith("rec-")) {
      numericId = parseInt(cleanId.replace("rec-", ""));
      isRecurring = true;
    } else {
      numericId = parseInt(cleanId);
    }

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
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
      status,
      assignedUsers,
    } = data;

    const cropId = farmCrop_id ? parseInt(farmCrop_id) : null;

    if (!isRecurring) {
      const existing = await db.task.findUnique({
        where: { id: numericId },
      });

      if (!existing) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      const updated = await db.task.update({
        where: { id: numericId },
        data: {
          title,
          description,
          taskType,
          status: status || existing.status,
          color: TASK_COLORS[taskType] ?? existing.color,
          startDate: startDate ? new Date(startDate) : existing.startDate,
          endDate: endDate ? new Date(endDate) : existing.endDate,
          recurrence: recurrence ?? existing.recurrence,
          farmCrop_id: cropId,
        },
      });

      if (Array.isArray(assignedUsers)) {
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

      return NextResponse.json({ task: fullTask }, { status: 200 });
    } else {
      const existing = await db.recurringTask.findUnique({
        where: { id: numericId },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Recurring task not found" },
          { status: 404 }
        );
      }

      const updatedRecurring = await db.recurringTask.update({
        where: { id: numericId },
        data: {
          title,
          description,
          taskType,
          color: TASK_COLORS[taskType] ?? existing.color,
          startDate: startDate ? new Date(startDate) : existing.startDate,
          endDate: endDate ? new Date(endDate) : existing.endDate,
          recurrence: recurrence ?? existing.recurrence,
          farmCrop_id: cropId,
        },
      });

      return NextResponse.json(
        { recurringTask: updatedRecurring },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Error updating task:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id)
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });

    
    let cleanId = String(id);

    if (cleanId.startsWith("task-")) {
      cleanId = cleanId.replace("task-", "");
    }

    let numericId;
    let isRecurring = false;

    if (cleanId.startsWith("rec-")) {
      numericId = parseInt(cleanId.replace("rec-", ""));
      isRecurring = true;
    } else {
      numericId = parseInt(cleanId);
    }

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    if (!isRecurring) {
      // One-off task
      const task = await db.task.findUnique({ where: { id: numericId } });
      if (!task)
        return NextResponse.json({ error: "Task not found" }, { status: 404 });

      await db.taskAssignment.deleteMany({ where: { task_id: numericId } });
      await db.taskNote.deleteMany({ where: { task_id: numericId } });
      await db.task.delete({ where: { id: numericId } });

      return NextResponse.json({ message: "Task deleted" }, { status: 200 });
    } else {
      
      const recurringTask = await db.recurringTask.findUnique({
        where: { id: numericId },
      });
      if (!recurringTask)
        return NextResponse.json(
          { error: "Recurring task not found" },
          { status: 404 }
        );

      await db.recurringTaskException.deleteMany({
        where: { recurringTask_id: numericId },
      });
      await db.recurringTask.delete({ where: { id: numericId } });

      return NextResponse.json(
        { message: "Recurring task deleted" },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
