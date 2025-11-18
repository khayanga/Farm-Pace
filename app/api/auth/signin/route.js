
import db from "@/lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "1h" }
    );

    return Response.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}