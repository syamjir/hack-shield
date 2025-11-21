import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { JwtService } from "./lib/jwtService";

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    //  API routes
    "/api/password/:path*",
    // Protect dashboard paths explicitly
    "/dashboard/:path*",
  ],
  runtime: "nodejs",
};
const isClerkProtected = createRouteMatcher(["/home(.*)", "/auth(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // -------------- Clerk Middleware logic --------------
  if (isClerkProtected(req)) {
    await auth.protect();
    return;
  }

  // -------------- Custom JWT Middleware logic --------------
  const url = req.nextUrl.pathname;

  // Protect only dashboard and API/password routes
  if (
    url.startsWith("/dashboard") ||
    url.startsWith("/api/logins") ||
    url.startsWith("/api/identities") ||
    url.startsWith("/api/notes") ||
    url.startsWith("/api/cards")
  ) {
    // ✅ Get JWT from cookies
    const token = req.cookies.get("jwt")?.value;

    if (!token) {
      // Redirect for dashboard pages, JSON for API
      if (url.startsWith("/api")) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      // Decode or verify JWT
      const jwtService = new JwtService();
      const decoded = await jwtService.decodeJwtToken(token);
      console.log(decoded.id);
      // ✅ Forward user ID to downstream routes
      const headers = new Headers(req.headers);
      headers.set("userId", decoded.id);

      return NextResponse.next({ request: { headers } });
    } catch (err) {
      console.error("JWT decode failed:", err);

      if (url.startsWith("/api")) {
        return NextResponse.json(
          { error: "Invalid or expired session" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // ✅ Default: allow all other routes
  return NextResponse.next();
});
