import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "1") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow the maintenance page itself to avoid infinite redirects
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/maintenance", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - / (home)
     * - /api/* (API routes remain accessible)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt, /sitemap.xml, /feed.xml (static/SEO)
     */
    "/((?!$|api/|_next/|favicon\\.ico|robots\\.txt).*)",
  ],
};
