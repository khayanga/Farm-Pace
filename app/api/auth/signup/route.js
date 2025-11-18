import db from "@/lib/prisma.js";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req,) {
  try {
    const { name, email, password } = await req.json();

    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    
    const existing = await db.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role:"admin"
      },
    });

    
    return NextResponse.json(
      { id: user.user_id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
