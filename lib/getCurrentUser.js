import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getCurrentUser(req) {
  try {
    const authHeader = req.headers.get
      ? req.headers.get("authorization")
      : req.headers?.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

      return {
        user_id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    }
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    return {
      user_id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };
    
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}
