import { getCurrentUser } from "@/lib/getCurrentUser";
import bcrypt from "bcrypt";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { welcomeEmailTemplate } from "@/emails/templates/welcome";

// Helper to generate temporary password
function generateTempPassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req) {
  try {
    // Check admin access
    const admin = await getCurrentUser(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { name, email, role, farmCode } = await req.json();
    if (!name || !email || !role || !farmCode) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Find the farm
    const farm = await db.farm.findUnique({ where: { code: farmCode } });
    if (!farm) return NextResponse.json({ error: "Farm not found" }, { status: 404 });

    // Check if user exists
    let user = await db.user.findUnique({ where: { email } });
    let tempPassword = null;

    if (!user) {
      
      tempPassword = generateTempPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          forcePasswordReset: true, 
        },
      });

      
      await sendEmail({
        to: email,
        subject: "Welcome to FarmPace!",
        html: welcomeEmailTemplate(name, tempPassword, farm.name, farm.code),
      });
    }

    
    const farmUser = await db.farmUser.create({
      data: {
        user_id: user.user_id,
        farm_id: farm.id,
        role,
      },
      include: {
        farm: { select: { code: true, name: true } },
      },
    });

    
    return NextResponse.json(
      {
        message: "User created and assigned to farm",
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          farmRole: farmUser.role,
          farmCode: farmUser.farm.code,
          
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
