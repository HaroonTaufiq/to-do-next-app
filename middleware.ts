import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })

  if (!token) {
    if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/edit")) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  if (token) {
    if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/edit/:path*", "/login", "/register"],
}

