import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { JwtService } from "./lib/jwtService";

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes
    "/api/password/:path*",
    "/api/logins/:path*",
    "/api/identities/:path*",
    "/api/notes/:path*",
    "/api/cards/:path*",
    "/api/admin/:path*", // ⬅ NEW ADMIN API PATH
    // Dashboard paths
    "/dashboard/:path*",
    "/admin/:path*", // ⬅ ADMIN DASHBOARD PATH
  ],
  runtime: "nodejs",
};

const isClerkProtected = createRouteMatcher(["/home(.*)", "/auth(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  //
  // ---------------- Clerk Middleware Logic ----------------
  //
  if (isClerkProtected(req)) {
    await auth.protect();
    return;
  }

  //
  // ---------------- JWT Middleware Logic ----------------
  //
  const url = req.nextUrl.pathname;

  const isProtectedGeneral =
    url.startsWith("/dashboard") ||
    url.startsWith("/api/logins") ||
    url.startsWith("/api/identities") ||
    url.startsWith("/api/notes") ||
    url.startsWith("/api/cards");

  const isAdminRoute =
    url.startsWith("/admin") || // Admin dashboard UI
    url.startsWith("/api/admin"); // Admin API

  // ---------------- Require JWT for Protected Routes ----------------
  if (isProtectedGeneral || isAdminRoute) {
    const token = req.cookies.get("jwt")?.value;

    if (!token) {
      // API request
      if (url.startsWith("/api")) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }

      // UI route
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ---------------- Validate JWT ----------------
    try {
      const jwtService = new JwtService();
      const decoded = await jwtService.decodeJwtToken(token);
      console.log(decoded);
      const userId = decoded.id;
      const userRole = decoded.role; // EXPECT role IN JWT

      if (!userId) throw new Error("Invalid token payload");

      //
      // ---------------- Admin Authorization Logic ----------------
      //
      if (isAdminRoute) {
        if (userRole !== "Admin") {
          // ❌ Non-admin accesses admin API
          if (url.startsWith("/api")) {
            return NextResponse.json(
              { error: "Forbidden. Admin access only." },
              { status: 403 }
            );
          }

          // ❌ Non-admin accesses admin UI
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
      }

      //
      // ---------------- Forward User + Role to API/Pages ----------------
      //
      const headers = new Headers(req.headers);
      headers.set("userId", userId);
      headers.set("userRole", userRole ?? "User");

      return NextResponse.next({
        request: { headers },
      });
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

  //
  // ---------------- Default: Allow Everything Else ----------------
  //
  return NextResponse.next();
});
