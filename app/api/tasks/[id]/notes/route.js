import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req, context) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await context.params;
    if (!taskId) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const { note, imageUrl } = await req.json();
    if (!["admin", "agronomist"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newNote = await db.taskNote.create({
      data: {
        task_id: parseInt(taskId),
        user_id: user.user_id,
        note,
        imageUrl: imageUrl || null,
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json({ note: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating task note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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
