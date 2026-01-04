import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { JwtService } from "./lib/jwtService";

/**
 * Middleware route matching configuration
 */
export const config = {
  matcher: [
    // Exclude Next.js internals & static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Protected API routes
    "/api/password/:path*",
    "/api/logins/:path*",
    "/api/identities/:path*",
    "/api/notes/:path*",
    "/api/cards/:path*",
    "/api/admin/:path*",

    // Protected UI routes
    "/dashboard/:path*",
    "/admin/:path*",
  ],
  runtime: "nodejs",
};

// Clerk-protected routes
const isClerkProtected = createRouteMatcher(["/home(.*)", "/auth(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  /**
   * Clerk authentication handling
   */
  if (isClerkProtected(req)) {
    await auth.protect();
    return;
  }

  /**
   * JWT-protected routes
   */
  const url = req.nextUrl.pathname;

  const isProtectedGeneral =
    url.startsWith("/dashboard") ||
    url.startsWith("/api/logins") ||
    url.startsWith("/api/identities") ||
    url.startsWith("/api/notes") ||
    url.startsWith("/api/cards") ||
    url.startsWith("/api/user") ||
    url.startsWith("/api/messages") ||
    url.startsWith("/api/auth/logout");

  const isAdminRoute =
    url.startsWith("/admin") ||
    url.startsWith("/api/admin");

  if (isProtectedGeneral || isAdminRoute) {
    const token = req.cookies.get("jwt")?.value;

    // Missing JWT
    if (!token) {
      if (url.startsWith("/api")) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      const jwtService = new JwtService();
      const decoded = await jwtService.decodeJwtToken(token);

      const userId = decoded.id;
      const userRole = decoded.role;

      if (!userId) throw new Error("Invalid token payload");

      /**
       * Admin authorization
       */
      if (isAdminRoute && userRole !== "Admin") {
        if (url.startsWith("/api")) {
          return NextResponse.json(
            { error: "Forbidden. Admin access only." },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      /**
       * Forward user context
       */
      const headers = new Headers(req.headers);
      headers.set("userId", userId);
      headers.set("userRole", userRole ?? "User");

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

  /**
   * Public routes
   */
  return NextResponse.next();
});
