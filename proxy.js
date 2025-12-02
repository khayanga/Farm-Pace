
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/signin", "/signup", "/api/auth", "/_next", "/favicon.ico"];

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });



  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = !isPublic;

  
  if (isProtected && !session) {
    const signinUrl = new URL("/signin", req.url);
    signinUrl.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(signinUrl);
  }

  
  if (isPublic && session && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};