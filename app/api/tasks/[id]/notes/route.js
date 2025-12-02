import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let { id: taskId } = await context.params;
    if (!taskId) return NextResponse.json({ error: "Missing task ID" }, { status: 400 });

    let cleanId = String(taskId);
    if (cleanId.startsWith("task-")) cleanId = cleanId.replace("task-", "");

    let isRecurring = false;
    if (cleanId.startsWith("rec-")) {
      cleanId = cleanId.replace("rec-", "");
      isRecurring = true;
    }

    const parsedId = parseInt(cleanId);
    if (isNaN(parsedId)) return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });

    const { note, imageUrl } = await req.json();
    if (!note) return NextResponse.json({ error: "Note content is required" }, { status: 400 });

    if (!["admin", "agronomist"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    
    const taskExists = isRecurring
      ? await db.recurringTask.findUnique({ where: { id: parsedId } })
      : await db.task.findUnique({ where: { id: parsedId } });

    if (!taskExists) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    
    const newNote = await db.taskNote.create({
      data: {
        note,
        imageUrl: imageUrl || null,
        user_id: user.user_id,
        ...(isRecurring
          ? { recurringTask_id: parsedId }
          : { task_id: parsedId }),
      },
      include: { user: true },
    });

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    console.error("Error creating task note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PATCH(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: taskId } = await context.params;

    if (!taskId) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const { noteId, note, imageUrl } = await req.json();
    if (!["admin", "agronomist"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingNote = await db.taskNote.findUnique({
      where: { id: parseInt(noteId) },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const updatedNote = await db.taskNote.update({
      where: { id: parseInt(noteId) },
      data: {
        note,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error("Error updating task note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
    const { id: taskId } = await context.params;
    if (!taskId) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const { noteId } = await req.json();
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingNote = await db.taskNote.findUnique({
      where: { id: parseInt(noteId) },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db.taskNote.delete({
      where: { id: parseInt(noteId) },
    });

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
