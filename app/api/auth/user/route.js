import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req) {
  const user = await getCurrentUser(req);

  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  // Fetch user + farm
  const fullUser = await db.user.findUnique({
    where: { user_id: user.user_id },
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      farms: {
        select: {
          farm: {
            select: { id: true, name: true, code: true, location: true }
          },
          role: true
        }
      }
    }
  });

  const farm = fullUser.farms[0]?.farm || null;

  return NextResponse.json({
    user: {
      ...fullUser,
      farm, 
    }
  });
}

