// Fetching all users and managing them

import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.user.findMany({
      where: {
        role: {
          not: "admin",
        },
      },
      include: {
        farms: {
          include: {
            farm: true,
          },
        },
      },
    });

    const formatted = users.map((u) => ({
      userId: u.user_id,
      name: u.name,
      email: u.email,
      globalRole: u.role,
      farms: u.farms.map((fu) => ({
        farmId: fu.farm_id,
        farmName: fu.farm.name,
        farmCode: fu.farm.code,
        farmLocation: fu.farm.location,
        role: fu.role,
      })),
    }));

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error("Failed to fetch all users", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
