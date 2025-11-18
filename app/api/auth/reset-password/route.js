import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/prisma.js";

export async function PATCH(req) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { user_id: user.user_id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ compare old password
    const isValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    // ✅ hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.user.update({
       where: { user_id: user.user_id },
      data: {
        password: hashed,
        forcePasswordReset: false,
      },
    });

    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}
