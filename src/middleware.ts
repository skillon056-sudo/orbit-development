import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, sessionCookieName } from "@/lib/auth";

// Protect /admin/** (except the login page). Runs on the edge; jose works here.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = req.cookies.get(sessionCookieName())?.value;
  const session = await verifyToken(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
