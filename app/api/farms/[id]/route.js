
import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

     const params = await context.params
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing farm ID" }, { status: 400 });
    }

    const { name, gps, location } = await req.json();

    if (!name || !gps || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Ensure the farm belongs to this user
    const farmUser = await db.farmUser.findFirst({
      where: { user_id: user.user_id, farm_id: id },
    });

    if (!farmUser)
      return NextResponse.json(
        { error: "You are not allowed to edit this farm" },
        { status: 403 }
      );

    const updatedFarm = await db.farm.update({
      where: { id },
      data: { name, gps, location },
    });

    return NextResponse.json(updatedFarm, { status: 200 });
  } catch (error) {
    console.error("Error updating farm:", error);
    return NextResponse.json({ error: "Failed to update farm" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const user = await getCurrentUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Missing farm ID" }, { status: 400 });
    }

    // ✅ Ensure ownership
    const farmUser = await db.farmUser.findFirst({
      where: { user_id: user.user_id, farm_id: id },
    });

    if (!farmUser)
      return NextResponse.json(
        { error: "You are not allowed to delete this farm" },
        { status: 403 }
      );

    // ✅ Delete the farm (CASCADE relations)
    await db.farm.delete({ where: { id } });

    return NextResponse.json({ message: "Farm deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting farm:", error);
    return NextResponse.json({ error: "Failed to delete farm" }, { status: 500 });
  }
}
