import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    const { id: farmId } = await context.params;
    const { name, email, role } = await req.json();

    if (!farmId) {
      return NextResponse.json({ error: "Missing farm ID" }, { status: 400 });
    }
    
     let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: { name, email, role },
      });
    }

    const existingAssignment = await db.farmUser.findFirst({
      where: {
        farm_id: farmId,
        user_id: user.user_id,
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "User already assigned to this farm" },
        { status: 400 }
      );
    }

    
    const farmUser = await db.farmUser.create({
      data: {
        role,
        farm: { connect: { id: farmId } },
        user: { connect: { user_id: user.user_id } },
      },
      include: { farm: { select: { code: true } }, user: true },
    });

    return NextResponse.json(farmUser, { status: 201 });
  } catch (error) {
    console.error("Error creating/assigning user:", error);
    return NextResponse.json(
      { error: "Failed to add user to farm", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  try {
    const manager = await getCurrentUser(req);
    if (!manager)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: farmId } = await context.params;

    const hasAccess = await db.farmUser.findFirst({
      where: {
        farm_id: farmId,
        user_id: manager.user_id,
      },
    });

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const farmUsers = await db.farmUser.findMany({
      where: { farm_id: farmId },
      include: { user: true },
    });

    const formattedUsers = farmUsers.map((fu) => ({
      user_id: fu.user.user_id,
      name: fu.user.name,
      email: fu.user.email,
      role: fu.role,
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (err) {
    console.error("Error fetching farm users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
